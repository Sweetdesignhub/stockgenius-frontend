/**
 * File: BrokerForm
 * Description: The BrokerForm component enables users to connect their Demat or broker accounts, supporting integration with Fyers and Zerodha for now. Users can select their preferred broker, fill in relevant credentials, and submit the form to save details in the database. The form dynamically displays broker-specific fields based on the selected broker and handles both the data storage and access token generation processes. The component is styled with Tailwind CSS and integrated with Redux for managing the current user's state.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useEffect, useState } from "react";
import Dropdown from "../common/Dropdown";
import Input from "../common/Input";
import FyersInputs from "../brokerInputs/FyersInputs";
import ZerodhaInputs from "../brokerInputs/ZerodhaInputs";
import api from "../../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function BrokerForm() {
  const [selectedOption, setSelectedOption] = useState("");
  const [accessToken, setAccessToken] = useState("");
  // console.log('access token : ', accessToken);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const [formData, setFormData] = useState({
    nickname: currentUser ? currentUser.name : "",
    mobileNumber: "",
    email: currentUser ? currentUser.email : "",
    fyersId: "",
    appId: "",
    secretId: "",
    zerodhaId: "",
    zerodhaPassword: "",
    totpKey: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      nickname: currentUser ? currentUser.name : "",
      mobileNumber: "",
      email: currentUser ? currentUser.email : "",
      fyersId: "",
      appId: "",
      secretId: "",
      zerodhaId: "",
      zerodhaPassword: "",
      totpKey: "",
    });
    setSelectedOption("");
  };

  const generateAccessToken = async (uri) => {
    try {
      // console.log(currentUser.id);
      const response = await api.post("/api/v1/fyers/generateAccessToken", {
        uri,
        userId: currentUser.id,
      });
      // console.log("response : ", response);
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      // console.log("Access Token:", accessToken);

      // Navigate based on localStorage country setting
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
    // console.log("authcode", authCode);
    if (authCode) {
      const uri = window.location.href;
      generateAccessToken(uri);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert("Please select a broker.");
      return;
    }

    let submitData = {
      nickname: formData.nickname,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      selectedOption: selectedOption,
    };

    if (selectedOption === "Fyers") {
      submitData = {
        ...submitData,
        fyersId: formData.fyersId,
        appId: formData.appId,
        secretId: formData.secretId,
        userId: currentUser.id,
      };

      try {
        // Save broker details in the database
        await api.post("/api/v1/fyers/saveCredentials", submitData);
        alert("Data saved successfully, Redirecting to Fyers ....");

        // Generate auth code URL
        const response = await api.get(
          `/api/v1/fyers/generateAuthCodeUrl/${currentUser.id}`
        );
        const { authCodeURL } = response.data;

        // Redirect to auth code URL
        window.location.href = authCodeURL;

        // Save authentication date in the database
        await api.post("/api/v1/fyers/saveAuthDate", {
          userId: currentUser.id,
          date: new Date().toISOString(),
        });

        // console.log("Authentication date saved for Fyers in database.");
      } catch (error) {
        console.error(
          "Failed to retrieve Fyers auth URL or save auth date:",
          error
        );
      }
    } else if (selectedOption === "Zerodha") {
      submitData = {
        ...submitData,
        zerodhaId: formData.zerodhaId,
        zerodhaPassword: formData.zerodhaPassword,
        totpKey: formData.totpKey,
        userId: currentUser.id,
      };
      try {
        // Save broker details in the database
        await api.post("/api/v1/zerodha/saveCredentials", submitData);

        // Implement Zerodha authentication flow here
      } catch (error) {
        console.error("Failed to save Zerodha credentials:", error);
      }
    }

    // Clear the form after submission
    setFormData({
      nickname: currentUser ? currentUser.name : "",
      mobileNumber: "",
      email: currentUser ? currentUser.email : "",
      fyersId: "",
      appId: "",
      secretId: "",
      zerodhaId: "",
      zerodhaPassword: "",
      totpKey: "",
    });
    setSelectedOption("");
  };

  return (
    <div className="">
      <div>
        <h1 className="font-semibold font-[poppins]">
          Connect Your Demat/Broker
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="dark:text-[#FFFFFFCC] text-black text-sm mb-2">
              Select Broker
            </label>
            <Dropdown
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              required
            />
          </div>
          <Input
            label="Nickname"
            name="nickname"
            defaultValue={currentUser ? currentUser.name : ""}
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder="Enter Nickname"
          />
          <Input
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter Mobile Number"
          />
          <Input
            label="Email Id"
            name="email"
            type="email"
            defaultValue={currentUser ? currentUser.email : ""}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
          />

          {selectedOption === "Fyers" && (
            <FyersInputs
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {selectedOption === "Zerodha" && (
            <ZerodhaInputs
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleClear}
            className="bg-[#FFFFFF] mr-3 text-[#FF0F0F] px-4 py-1 rounded-lg"
            style={{ boxShadow: "0px 9px 20px 0px #0000001A" }}
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-[#3A6FF8] text-[#FFFFFF] px-4 py-1 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default BrokerForm;
