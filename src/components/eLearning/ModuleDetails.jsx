import React, { useEffect, useRef, useState } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp,
  MdFullscreen,
  MdReplay10,
  MdForward10,
  MdMoreVert,
} from "react-icons/md";
import { VscMultipleWindows } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const ModuleDetails = ({
  module,
  onBack,
  onNext,
  onReturnToList,
  currentIndex,
  totalModules,
}) => {
  console.log(module);
  
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  const hasVideos = Array.isArray(module?.videos) && module.videos.length > 0;
  const currentVideo = hasVideos ? module.videos[videoIndex] : null;

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const skipForward = () => {
    videoRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 15;
  };

  const toggleFullScreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const goToPreviousVideo = () => {
    if (videoIndex > 0) {
      setVideoIndex(videoIndex - 1);
      setIsPlaying(false);
    }
  };

  const goToNextVideo = () => {
    if (videoIndex < module.videos.length - 1) {
      setVideoIndex(videoIndex + 1);
      setIsPlaying(false);
    } else {
      setShowQuizPopup(true); // show the popup
      setCountdown(5); // start from 5

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            // localStorage.setItem("selectedModuleIndex", currentIndex);
            navigate(`/quiz/module/${module.id}`); // redirect after countdown ends
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    setVideoIndex(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [module]);

  useEffect(() => {
    if (videoRef.current && hasVideos) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn("Autoplay failed:", err));
      }
    }
  }, [videoIndex]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Module Header & Navigation */}
      <div
        className="py-2 px-6 rounded-xl backdrop-blur-xl flex justify-between items-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(90, 64, 46, 0.15) 0%, rgba(51, 36, 27, 0.2) 100%)",
          boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div>
          <h2 className="text-md text-white font-[poppins]">{module.title}</h2>
          <p className="text-md text-white font-[poppins]">
            {module.description}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReturnToList}
            className="bg-white text-[#FF9400] flex items-center gap-1 px-2 py-1 rounded-lg transition-opacity"
          >
            <VscMultipleWindows />
          </button>

          <button
            onClick={onBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-opacity 
              ${
                currentIndex === 0
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "bg-[#FF9400] hover:bg-[#e68300] text-white"
              }
            `}
          >
            <MdNavigateBefore size={18} />
            {/* <span>Prev Module</span> */}
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex === totalModules - 1}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-opacity
              ${
                currentIndex === totalModules - 1
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "bg-[#FF9400] hover:bg-[#e68300] text-white"
              }
            `}
          >
            {/* <span>Next Module</span> */}
            <MdNavigateNext size={18} />
          </button>
        </div>
      </div>

      {/* Video Section or Message */}
      {!hasVideos ? (
        <div className="w-full h-[500px] flex items-center justify-center bg-black rounded-lg">
          <p className="text-white text-lg font-semibold">
            Videos are in progress...
          </p>
        </div>
      ) : (
        <div
          className="relative w-full rounded-lg overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            ref={videoRef}
            src={currentVideo?.url}
            className="w-full h-[510px] object-contain rounded-lg bg-black"
            onTimeUpdate={handleTimeUpdate}
            onEnded={goToNextVideo}
            controls={false}
          />

          {/* Hover Progress Bar */}
          {isHovered && (
            <div className="absolute bottom-16 left-0 w-full h-1 bg-gray-700">
              <div
                className="h-full bg-[#FF9400] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Video Controls */}
          {isHovered && (
            <div className="absolute bottom-4 left-0 w-full px-6 flex flex-col items-center">
              <div className="flex justify-center gap-4">
                <button
                  onClick={goToPreviousVideo}
                  disabled={videoIndex === 0}
                  className="text-white"
                >
                  <MdNavigateBefore size={26} />
                </button>
                <button onClick={skipBackward} className="text-white">
                  <MdReplay10 size={26} />
                </button>
                <button onClick={togglePlayPause} className="text-white">
                  {isPlaying ? (
                    <MdPause size={26} />
                  ) : (
                    <MdPlayArrow size={26} />
                  )}
                </button>
                <button onClick={skipForward} className="text-white">
                  <MdForward10 size={26} />
                </button>
                <button
                  onClick={goToNextVideo}
                  disabled={videoIndex === module.videos.length - 1}
                  className="text-white"
                >
                  <MdNavigateNext size={26} />
                </button>
              </div>

              <div className="absolute bottom-0 right-6 flex gap-4 items-center mb-1">
                <button onClick={toggleMute} className="text-white">
                  {isMuted ? (
                    <MdVolumeOff size={22} />
                  ) : (
                    <MdVolumeUp size={22} />
                  )}
                </button>
                <button onClick={toggleFullScreen} className="text-white">
                  <MdFullscreen size={22} />
                </button>
                <button className="text-white">
                  <MdMoreVert size={22} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showQuizPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black px-6 py-4 rounded-xl text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Quiz Time!</h2>
            <p className="text-md">Redirecting to quiz in {countdown}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetails;
