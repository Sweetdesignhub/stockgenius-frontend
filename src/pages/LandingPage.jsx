import { FaChevronRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Loading from "../components/common/Loading";
import api from "../config";
import { useSelector } from "react-redux";

function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const imagesLoaded = useRef(0);
  const { currentUser } = useSelector((state) => state.user);
  const region = useSelector((state) => state.region);

  useEffect(() => {
    const images = document.querySelectorAll("img");
    const totalImages = images.length;

    const handleLoad = () => {
      imagesLoaded.current++;
      if (imagesLoaded.current === totalImages) {
        setIsLoading(false);
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        handleLoad();
      } else {
        image.addEventListener("load", handleLoad);
      }
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener("load", handleLoad);
      });
    };
  }, []);

  const handleClick = () => {
    if (currentUser) {
      navigate(`${region}/dashboard`);
    } else {
      navigate("/sign-in");
    }
  };

  const [authCodeURL, setAuthCodeURL] = useState("");
  const [accessToken, setAccessToken] = useState("");
  // const navigate = useNavigate();

  const handleFyersAuth = async () => {
    try {
      const response = await api.get("/api/v1/fyers/generateAuthCodeUrl");
      const { authCodeURL } = response.data;
      window.location.href = authCodeURL;
    } catch (error) {
      console.error("Failed to retrieve Fyers auth URL:", error);
    }
  };

  const generateAccessToken = async (uri) => {
    try {
      const response = await api.post("/api/v1/fyers/generateAccessToken", {
        uri,
        userId: currentUser.id,
      });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      // console.log("Access Token:", accessToken);
      // navigate("/portfolio");
      if (localStorage.getItem("country") === "india") {
        navigate(`/india/portfolio`);
      } else if (localStorage.getItem("country") === "us") {
        navigate(`/us/portfolio`);
      }
    } catch (error) {
      console.error("Failed to generate access token:", error);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authCode = query.get("auth_code");
    if (authCode) {
      const uri = window.location.href;
      generateAccessToken(uri);
    }
  }, []);
  return (
    <div className="w-full min-h-[91vh] lg:min-h-[70vh]">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <Loading />
        </div>
      )}
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[30%] p-10">
          <img
            className="mx-auto"
            loading="lazy"
            src={
              theme === "light"
                ? "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fa067177f7963499ca4d056f4c4e13ebb"
                : "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F662557c8692a4b4297b10499be0fa13f"
            }
            alt="companies"
          />
        </div>
        <div className="w-full lg:w-[70%]">
          <img
            loading="lazy"
            className="w-full"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F2ef01924933544a6b74d9ab48c8cf6b6"
            alt="buy sell"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-8 mt-[-10px] lg:mt-[-100px]">
        <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-[poppins] lg:max-w-xl leading-snug uppercase">
            Insights Today, Profit Tomorrow
          </h1>
          <p className="font-inter mt-4">
            We help you use today's news to make smart money moves for the
            future. It's like having a crystal ball that shows you which steps
            to take now to earn more later. Our platform makes it super simple,
            guiding you every step of the way, no stock market jargon needed!
          </p>
        </div>
        <div className="w-full lg:w-2/5 lg:relative mb-20 lg:mb-0 ">
          <button
            onClick={handleClick}
            className="lg:absolute  flex items-center justify-center bottom-0 right-0 started text-white w-full lg:w-52 px-4 py-3 rounded-xl uppercase"
          >
            <p className="mr-5">Get Started</p> <FaChevronRight />
          </button>

          <div>
            <button style={{ display: "none" }} onClick={handleFyersAuth}>
              Authenticate with Fyers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
