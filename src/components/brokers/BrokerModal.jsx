import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../common/Dropdown";
import api from "../../config";
import { setFyersAccessToken } from "../../redux/brokers/fyersSlice";
import { useNavigate } from "react-router-dom";

const BrokerModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const fyersAccessToken = useSelector((state) => state.fyers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

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
      });
      const { accessToken } = response.data;
      // console.log("setting access");
      dispatch(setFyersAccessToken(accessToken));
      // console.log('set sucess');
      navigate("/india/dashboard");
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

  const handleAuthenticate = () => {
    if (selectedOption === "Fyers") {
      handleFyersAuth();
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

          <div className=" flex justify-center items-center">
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
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrokerModal;
