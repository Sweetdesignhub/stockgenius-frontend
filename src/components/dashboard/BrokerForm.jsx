import React, { useState } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";
import FyersInputs from "../brokerInputs/FyersInputs";
import ZerodhaInputs from "../brokerInputs/ZerodhaInputs";

function BrokerForm() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const [formData, setFormData] = useState({
    nickname: "",
    mobileNumber: "",
    email: "",
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
      nickname: "",
      mobileNumber: "",
      email: "",
      fyersId: "",
      appId: "",
      secretId: "",
      zerodhaId: "",
      zerodhaPassword: "",
      totpKey: "",
    });
    setSelectedOption("");
  };

  const handleSubmit = (e) => {
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
      };
    } else if (selectedOption === "Zerodha") {
      submitData = {
        ...submitData,
        zerodhaId: formData.zerodhaId,
        zerodhaPassword: formData.zerodhaPassword,
        totpKey: formData.totpKey,
      };
    }

    //  form submission logic 
    console.log("Form submitted with data:", submitData);

    // Clear the form after submission
    setFormData({
      nickname: "",
      mobileNumber: "",
      email: "",
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
            <label className="text-[#FFFFFFCC] text-sm mb-2">
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
