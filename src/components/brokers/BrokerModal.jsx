import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../common/Dropdown";
import api from "../../config";
import { setFyersAccessToken } from "../../redux/brokers/fyersSlice";
import { useNavigate } from "react-router-dom";

const BrokerModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fyersAccessToken = useSelector((state) => state.fyers);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFyersAuth = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/v1/fyers/generateAuthCodeUrl/${currentUser._id}`
      );
      const { authCodeURL } = response.data;
      window.location.href = authCodeURL;
    } catch (error) {
      console.error("Failed to retrieve Fyers auth URL:", error);
      setError("Failed to retrieve Fyers auth URL");
      setLoading(false);
    }
  };

  const generateAccessToken = async (uri) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/v1/fyers/generateAccessToken/${currentUser._id}`,
        {
          uri,
        }
      );
      const { accessToken } = response.data;
      dispatch(setFyersAccessToken(accessToken));

      startFetchingData(accessToken);
      navigate("/india/dashboard");
    } catch (error) {
      console.error("Failed to generate access token:", error);
      setError("Failed to generate access token");
      setLoading(false);
    }
  };

  // const startFetchingData = () => {
  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem('fyers_access_token');

  //       if (!token) {
  //         console.warn("Access token is missing, stopping data fetching.");
  //         clearInterval(fetchInterval); // Stop fetching if token is missing
  //         return; // Exit if token is not available
  //       }

  //       await api.post(`/api/v1/fyers/fetchProfileAndSave/${currentUser._id}`, {
  //         accessToken: token,
  //       });
  //       await api.post(`/api/v1/fyers/fetchFundsAndSave/${currentUser._id}`, {
  //         accessToken: token,
  //       });
  //       await api.post(`/api/v1/fyers/fetchOrdersAndSave/${currentUser._id}`, {
  //         accessToken: token,
  //       });
  //       await api.post(
  //         `/api/v1/fyers/fetchHoldingsAndSave/${currentUser._id}`,
  //         { accessToken: token }
  //       );
  //       await api.post(
  //         `/api/v1/fyers/fetchPositionsAndSave/${currentUser._id}`,
  //         { accessToken: token }
  //       );
  //       await api.post(`/api/v1/fyers/fetchTradesAndSave/${currentUser._id}`, {
  //         accessToken: token,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError("Error fetching data from Fyers");
  //     }
  //   };

  //   // Start fetching data immediately and set interval
  //   fetchData();
  //   const fetchInterval = setInterval(fetchData, 3000);

  //   // Cleanup function to clear interval on unmount
  //   return () => clearInterval(fetchInterval);
  // };

  const startFetchingData = () => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("fyers_access_token");

        if (!token) {
          console.warn("Access token is missing, stopping data fetching.");
          clearInterval(fetchInterval); // Stop fetching if token is missing
          return; // Exit if token is not available
        }

        await api.post(`/api/v1/fyers/fetchProfileAndSave/${currentUser._id}`, {
          accessToken: token,
        });
        await api.post(`/api/v1/fyers/fetchFundsAndSave/${currentUser._id}`, {
          accessToken: token,
        });
        await api.post(`/api/v1/fyers/fetchOrdersAndSave/${currentUser._id}`, {
          accessToken: token,
        });
        await api.post(
          `/api/v1/fyers/fetchHoldingsAndSave/${currentUser._id}`,
          { accessToken: token }
        );
        await api.post(
          `/api/v1/fyers/fetchPositionsAndSave/${currentUser._id}`,
          { accessToken: token }
        );
        await api.post(`/api/v1/fyers/fetchTradesAndSave/${currentUser._id}`, {
          accessToken: token,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data from Fyers");
      }
    };

    // Get current time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Define start and end time for the trading hours
    const startHour = 9;
    const startMinutes = 15;
    const endHour = 15;
    const endMinutes = 30;

    // Function to check if current time is within trading hours
    const isTradingHours = () => {
      if (
        (currentHour > startHour ||
          (currentHour === startHour && currentMinutes >= startMinutes)) &&
        (currentHour < endHour ||
          (currentHour === endHour && currentMinutes <= endMinutes))
      ) {
        return true;
      }
      return false;
    };

    // Check if current time is within trading hours
    if (isTradingHours()) {
      // Fetch data immediately and set interval to fetch every 3 seconds
      fetchData();
      const fetchInterval = setInterval(fetchData, 3000);

      // Cleanup function to clear interval on unmount
      return () => clearInterval(fetchInterval);
    } else {
      // Fetch data only once if outside trading hours
      fetchData();
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

  const handleAuthenticate = () => {
    if (selectedOption === "Fyers") {
      handleFyersAuth();
    } else {
      setError("Please select a valid broker");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white py-8 px-5 w-full max-w-lg mx-4 md:mx-auto rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 cursor-pointer text-4xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl md:text-4xl text-black text-center font-poppins font-semibold mb-4">
          Brokerage
        </h2>

        <div className="flex flex-col gap-5">
          <Dropdown
            selectedOption={selectedOption}
            handleOptionSelect={handleOptionSelect}
          />

          <div className="flex justify-center items-center">
            {selectedOption === "Fyers" && (
              <div className="mr-3">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F591d0894639c46fd9029293cbe823d89"
                  alt="Fyers"
                />
              </div>
            )}
            {selectedOption === "Zerodha" && (
              <div className="mr-3">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd314830a17a84ee5956be4ca2cee3c5a"
                  alt="Zerodha"
                />
              </div>
            )}
            {selectedOption === "Motilal Oswal" && (
              <div className="mr-3">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fe9a3e857c17e41ceac69d3e2acc20695"
                  alt="Motilal Oswal"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleAuthenticate}
            className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BrokerModal;
