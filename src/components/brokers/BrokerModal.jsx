import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../common/Dropdown";
import api from "../../config";
import { setFyersAccessToken } from "../../redux/brokers/fyersSlice";
import { setZerodhaAccessToken } from "../../redux/brokers/zerodhaSlice";
import { useNavigate } from "react-router-dom";

const BrokerModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchIntervalRef = useRef(null);
  const userId = currentUser.id;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const isTradingHours = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const startHour = 9;
    const startMinutes = 15;
    const endHour = 15;
    const endMinutes = 30;

    return (
      (currentHour > startHour ||
        (currentHour === startHour && currentMinutes >= startMinutes)) &&
      (currentHour < endHour ||
        (currentHour === endHour && currentMinutes <= endMinutes))
    );
  };

  const fetchFyersData = async (token) => {
    if (!token) {
      console.warn("Fyers access token is missing, stopping data fetching.");
      clearInterval(fetchIntervalRef.current);
      return;
    }

    try {
      await Promise.all([
        api.post(`/api/v1/fyers/fetchProfileAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/fyers/fetchFundsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/fyers/fetchOrdersAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/fyers/fetchHoldingsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/fyers/fetchPositionsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/fyers/fetchTradesAndSave/${userId}`, { accessToken: token }),
      ]);
    } catch (err) {
      console.error("Error fetching data from Fyers:", err);
      setError("Error fetching data from Fyers");
    }
  };

  const fetchZerodhaData = async (token) => {
    if (!token) {
      console.warn("Zerodha access token is missing, stopping data fetching.");
      clearInterval(fetchIntervalRef.current);
      return;
    }

    try {
      await Promise.all([
        api.post(`/api/v1/zerodha/fetchProfileAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/zerodha/fetchFundsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/zerodha/fetchOrdersAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/zerodha/fetchHoldingsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/zerodha/fetchPositionsAndSave/${userId}`, { accessToken: token }),
        api.post(`/api/v1/zerodha/fetchTradesAndSave/${userId}`, { accessToken: token }),
      ]);
    } catch (err) {
      console.error("Error fetching data from Zerodha:", err);
      setError("Error fetching data from Zerodha");
    }
  };

  const startFetchingData = () => {
    const fyersToken = localStorage.getItem("fyers_access_token");
    const zerodhaToken = localStorage.getItem("zerodha_access_token");

    // Clear any existing intervals
    clearInterval(fetchIntervalRef.current);

    // Fetch Fyers data if Fyers token is found
    if (fyersToken) {
      fetchFyersData(fyersToken);
      if (isTradingHours()) {
        fetchIntervalRef.current = setInterval(() => fetchFyersData(fyersToken), 12000);
      }
    }

    // Fetch Zerodha data if Zerodha token is found
    if (zerodhaToken) {
      fetchZerodhaData(zerodhaToken);
      if (isTradingHours()) {
        fetchIntervalRef.current = setInterval(() => fetchZerodhaData(zerodhaToken), 12000);
      }
    }
  };

  useEffect(() => {
    startFetchingData();

    // Cleanup interval when component unmounts
    return () => clearInterval(fetchIntervalRef.current);
  }, [userId]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const fyersAuthCode = query.get("auth_code");
    const zerodhaRequestToken = query.get("request_token");

    if (fyersAuthCode) {
      const uri = window.location.href;
      generateFyersAccessToken(uri);
    }

    if (zerodhaRequestToken) {
      const uri = window.location.href;
      generateZerodhaAccessToken(uri);
    }
  }, []);

  const generateFyersAccessToken = async (uri) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/v1/fyers/generateAccessToken/${currentUser.id}`, { uri });
      const { accessToken } = response.data;
      dispatch(setFyersAccessToken(accessToken));

      startFetchingData();
      navigate("/india/dashboard");
    } catch (error) {
      console.error("Failed to generate Fyers access token:", error);
      setError("Failed to generate Fyers access token");
      setLoading(false);
    }
  };

  const generateZerodhaAccessToken = async (uri) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/v1/zerodha/generateAccessToken/${currentUser.id}`, { uri });
      const { accessToken } = response.data;
      dispatch(setZerodhaAccessToken(accessToken));

      startFetchingData();
      navigate("/india/dashboard");
    } catch (error) {
      console.error("Failed to generate Zerodha access token:", error);
      setError("Failed to generate Zerodha access token");
      setLoading(false);
    }
  };

  const handleAuthenticate = () => {
    if (selectedOption === "Fyers") {
      handleFyersAuth();
    } else if (selectedOption === "Zerodha") {
      handleZerodhaAuth();
    } else {
      setError("Please select a valid broker");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white py-8 px-5 w-full max-w-lg mx-4 md:mx-auto rounded-2xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-4xl text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-2xl md:text-4xl text-black text-center font-poppins font-semibold mb-4">Brokerage</h2>
        <div className="flex flex-col gap-5">
          <Dropdown selectedOption={selectedOption} handleOptionSelect={handleOptionSelect} />
          <div className="flex justify-center items-center">
            {selectedOption === "Fyers" && (
              <div className="mr-3">
                <img loading="lazy" src="Fyers_Logo_URL" alt="Fyers" />
              </div>
            )}
            {selectedOption === "Zerodha" && (
              <div className="mr-3">
                <img loading="lazy" src="Zerodha_Logo_URL" alt="Zerodha" />
              </div>
            )}
          </div>
          <button onClick={handleAuthenticate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" disabled={loading}>
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BrokerModal;
