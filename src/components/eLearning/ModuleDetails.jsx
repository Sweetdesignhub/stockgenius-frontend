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
import { useParams, useNavigate } from "react-router-dom";

const ModuleDetails = () => {
  const { moduleId } = useParams(); // Get moduleId from URL (e.g., "1", "2", etc.)
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Module data
  const modules = [
    {
      id: "1",
      title: "Module 1",
      description: "Introduction to Stock Market Basics (Super Simple)",
      bgImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F449e542a8e474ca09fb87ff0dbf82cfc",
      descColor: "#CCFDFF",
      content:
        "🚀 Learn the basics of stock market investing with real-world examples.",
      videos: [
        {
          title: "Scence 1 (1)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F6a940b51a6ac498d8381e0f9fc0eae3f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=6a940b51a6ac498d8381e0f9fc0eae3f&alt=media&optimized=true",
        },
        {
          title: "section before lesson (2)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Ffa41c1476acf408280d90818bb99b08f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=fa41c1476acf408280d90818bb99b08f&alt=media&optimized=true",
        },
        {
          title: "lesson 1 (3)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fdaf30f7efd8c4eaa99139edbad372b5f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=daf30f7efd8c4eaa99139edbad372b5f&alt=media&optimized=true",
        },
        {
          title: "filler 2 (4)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F9944509d1a06489195b104db24540fcb%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=9944509d1a06489195b104db24540fcb&alt=media&optimized=true",
        },
        {
          title: "lesson 2 (5)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F5ad366a3f3fa4f819ba306b2f86c3309%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=5ad366a3f3fa4f819ba306b2f86c3309&alt=media&optimized=true",
        },
        {
          title: "filler 3 (6)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fc84ab01f393e4a6f9cb5c907659e86e5%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=c84ab01f393e4a6f9cb5c907659e86e5&alt=media&optimized=true",
        },
        {
          title: "lesson 3 (7)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F97f5f74f2aa04f46b33224ff16838442%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=97f5f74f2aa04f46b33224ff16838442&alt=media&optimized=true",
        },
        {
          title: "filler 3 & 4 (8)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F0916f029773c443fa71981cf228357a9%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=0916f029773c443fa71981cf228357a9&alt=media&optimized=true",
        },
        {
          title: "lesson 4 (9)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F829eba082e2d4435864352c9c269f528%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=829eba082e2d4435864352c9c269f528&alt=media&optimized=true",
        },
        {
          title: "after lesson 4 (10)",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F5e8cb89c8bff4b9d95d249056c6bdebd%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=5e8cb89c8bff4b9d95d249056c6bdebd&alt=media&optimized=true",
        },
      ],
    },
    {
      id: "2",
      title: "Module 2",
      description: "Understanding Derivatives (Super Simple Story)",
      bgImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F3636bc3d3ef1489e9bab8d4ec141ba99",
      descColor: "#D6FFF0",
      content: "📈 Understand how derivatives work and how traders use them.",
      videos: [
        {
          title: "video 1, module 2",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F63118228763d4f0a9166324cf0caa748%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=63118228763d4f0a9166324cf0caa748&alt=media&optimized=true",
        },
      ],
    },
    {
      id: "3",
      title: "Module 3",
      description: "What Are Futures Contracts? (Super Simple with Story)",
      bgImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F044f0c30f30240cb9763f0640450ef68",
      descColor: "#FFF0F0",
      content: "🔮 Explore the mechanics of futures contracts in trading.",
      videos: [
        {
          title: "video 1, module 3",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F3e78b7a3210541569563fab7e178c50c%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=3e78b7a3210541569563fab7e178c50c&alt=media&optimized=true",
        },
      ], // No videos provided, will show "Videos are in progress..."
    },
    {
      id: "4",
      title: "Module 4",
      description: "What are Options Contracts? (Super Simple with Stories)",
      bgImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F48eb8037a3664f94827e5c54e88ee8f1",
      descColor: "#FFEECC",
      content: "💡 Options contracts explained in the simplest way possible!",
      videos: [
        {
          title: "video 1, module 4",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fb80356695d8b482d979b8f3465db8a79%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=b80356695d8b482d979b8f3465db8a79&alt=media&optimized=true",
        },
      ], // No videos provided
    },
    {
      id: "5",
      title: "Module 5",
      description: "Understanding Option Chain",
      bgImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fa369009079804034898ca9186a441725",
      descColor: "#CDFFCC",
      content: "📊 Learn how to analyze an option chain like a pro.",
      videos: [
        {
          title: "video 1, module 5",
          url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F348918b434444b08a6821bac1872a7c8%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=348918b434444b08a6821bac1872a7c8&alt=media&optimized=true",
        },
      ], // No videos provided
    },
  ];

  // Find the current module by ID
  const module = modules.find((m) => m.id === moduleId) || {
    id: "not-found",
    title: "Module Not Found",
    description: "This module does not exist.",
    videos: [],
  };

  const hasVideos = Array.isArray(module.videos) && module.videos.length > 0;
  const currentVideo = hasVideos ? module.videos[videoIndex] : null;

  // Functions for Previous and Next Module navigation
  const goToPreviousModule = () => {
    const currentIndex = modules.findIndex((m) => m.id === moduleId);
    if (currentIndex > 0) {
      const prevModuleId = modules[currentIndex - 1].id;
      navigate(`/e-learning/learning/${prevModuleId}`);
    }
  };

  const goToNextModule = () => {
    const currentIndex = modules.findIndex((m) => m.id === moduleId);
    if (currentIndex < modules.length - 1) {
      const nextModuleId = modules[currentIndex + 1].id;
      navigate(`/e-learning/learning/${nextModuleId}`);
    }
  };

  // Video control functions
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
      setShowQuizPopup(true);
      setCountdown(5);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            // Check if quiz exists for this module
            const hasQuiz = ["1", "2", "3", "4", "5"].includes(moduleId); // Only modules 1 and 2 have quizzes based on quizMap
            if (hasQuiz) {
              navigate(`/quiz/module/${moduleId}`);
            } else {
              // If no quiz, go to next module or back to learning tab
              const currentIndex = modules.findIndex((m) => m.id === moduleId);
              if (currentIndex < modules.length - 1) {
                navigate(
                  `/e-learning/learning/${modules[currentIndex + 1].id}`
                );
              } else {
                navigate("/e-learning/learning");
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Reset video state when module changes
  useEffect(() => {
    setVideoIndex(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [moduleId]);

  // Autoplay video when videoIndex changes
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
  }, [videoIndex, hasVideos]);

  const currentIndex = modules.findIndex((m) => m.id === moduleId);
  const isFirstModule = currentIndex === 0;
  const isLastModule = currentIndex === modules.length - 1;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Module Header & Navigation */}
      <div
        className="py-2 px-3 sm:px-6 rounded-xl backdrop-blur-xl flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between"
        style={{
          background:
            "linear-gradient(180deg, rgba(90, 64, 46, 0.15) 0%, rgba(51, 36, 27, 0.2) 100%)",
          boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Module Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-md text-white font-[poppins] truncate">
            {module.title}
          </h2>
          <p className="text-xs sm:text-md text-white font-[poppins] truncate">
            {module.description}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => navigate("/e-learning/learning")}
            className="bg-white text-[#FF9400] flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg transition-opacity"
            title="Back to Learning"
          >
            <VscMultipleWindows size={16} />
          </button>

          <button
            onClick={goToPreviousModule}
            disabled={isFirstModule}
            className={`flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg transition-opacity 
        ${
          isFirstModule
            ? "bg-gray-500 cursor-not-allowed opacity-50"
            : "bg-[#FF9400] hover:bg-[#e68300] text-white"
        }
      `}
            title="Previous Module"
          >
            <MdNavigateBefore size={16} />
          </button>

          <button
            onClick={goToNextModule}
            disabled={isLastModule}
            className={`flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg transition-opacity
        ${
          isLastModule
            ? "bg-gray-500 cursor-not-allowed opacity-50"
            : "bg-[#FF9400] hover:bg-[#e68300] text-white"
        }
      `}
            title="Next Module"
          >
            <MdNavigateNext size={16} />
          </button>
        </div>
      </div>

      {/* Video Section or Message */}
      {!hasVideos ? (
        <div className="w-full aspect-video flex items-center justify-center bg-black/50 rounded-lg backdrop-blur">
          <p className="text-white text-lg font-semibold">
            Videos are in progress...
          </p>
        </div>
      ) : (
        <div
          className="relative w-full aspect-video rounded-lg overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            ref={videoRef}
            src={currentVideo?.url}
            className="w-full h-full object-cover rounded-lg"
            onTimeUpdate={handleTimeUpdate}
            onEnded={goToNextVideo}
            controls={false}
            playsInline
          />{" "}
          {/* Hover Progress Bar */}
          {isHovered && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 md:bottom-16 left-0 w-full px-2 md:px-6">
                {/* Video Title */}
                {/* <h3 className="text-white text-xs md:text-base font-medium mb-1 md:mb-2">
                  {currentVideo?.title || "Video"}
                </h3> */}
                {/* Progress Bar */}
                <div
                  className="w-full h-0.5 md:h-1 bg-white/30 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = x / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime =
                        percent * videoRef.current.duration;
                    }
                  }}
                >
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Timestamp */}{" "}
                <div className="flex justify-between text-white text-[10px] md:text-xs mt-0.5 md:mt-1">
                  <span>
                    {videoRef.current
                      ? `${Math.floor(
                          videoRef.current.currentTime / 60
                        )}:${String(
                          Math.floor(videoRef.current.currentTime % 60)
                        ).padStart(2, "0")}`
                      : "0:00"}
                  </span>
                  <span>
                    {videoRef.current
                      ? `${Math.floor(videoRef.current.duration / 60)}:${String(
                          Math.floor(videoRef.current.duration % 60)
                        ).padStart(2, "0")}`
                      : "0:00"}
                  </span>
                </div>
              </div>
            </>
          )}
          {/* Video Controls */}
          {isHovered && (
            <div className="absolute bottom-1 md:bottom-4 left-0 w-full px-1 md:px-6 flex flex-col items-center">
              {/* Main Controls */}
              <div className="flex justify-center items-center gap-0.5 md:gap-4 md:mb-0">
                <button
                  onClick={goToPreviousVideo}
                  disabled={videoIndex === 0}
                  className="text-white p-0.5 md:p-2"
                >
                  <MdNavigateBefore size={14} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={skipBackward}
                  className="text-white p-0.5 md:p-2"
                >
                  <MdReplay10 size={14} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="text-white p-0.5 md:p-2"
                >
                  {isPlaying ? (
                    <MdPause size={14} className="md:w-6 md:h-6" />
                  ) : (
                    <MdPlayArrow size={14} className="md:w-6 md:h-6" />
                  )}
                </button>
                <button
                  onClick={skipForward}
                  className="text-white p-0.5 md:p-2"
                >
                  <MdForward10 size={14} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={goToNextVideo}
                  disabled={videoIndex === module.videos.length - 1}
                  className="text-white p-0.5 md:p-2"
                >
                  <MdNavigateNext size={14} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Right-side Controls */}
              <div className="absolute bottom-0 right-1 md:right-6 flex gap-0.5 md:gap-4 items-center">
                <button
                  onClick={toggleMute}
                  className="text-white p-0.5 md:p-1.5"
                >
                  {isMuted ? (
                    <MdVolumeOff size={12} className="md:w-5 md:h-5" />
                  ) : (
                    <MdVolumeUp size={12} className="md:w-5 md:h-5" />
                  )}
                </button>{" "}
                <button
                  onClick={toggleFullScreen}
                  className="text-white p-0.5 md:p-1.5"
                >
                  <MdFullscreen size={12} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      // Force showing native context menu for video options
                      const rect = videoRef.current.getBoundingClientRect();
                      const event = new MouseEvent("contextmenu", {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 2,
                        buttons: 2,
                        clientX: rect.right - 50,
                        clientY: rect.bottom - 50,
                      });
                      videoRef.current.dispatchEvent(event);
                    }
                  }}
                  className="text-white p-0.5 md:p-1.5"
                >
                  <MdMoreVert size={12} className="md:w-5 md:h-5" />
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
