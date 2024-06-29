import React, { useEffect, useState } from "react";
import Dropdown from "../../common/Dropdown";
import api from "../../../config";

function Header() {
  const [selectedOption, setSelectedOption] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    if (option === "Fyers") {
      handleFyersAuth();
    }
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

  const generateFyersAccessToken = async (uri) => {
    try {
      const response = await api.post("/api/v1/fyers/generateAccessToken", {
        uri,
      });
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } catch (error) {
      console.error("Failed to generate access token:", error);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authCode = query.get("auth_code");
    if (authCode) {
      const uri = window.location.href;
      generateFyersAccessToken(uri);
    }
  }, []);

  return (
    <div className="flex justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold">Account Manager</h1>
      <div className="max-h-10">
        {selectedOption === "Fyers" && (
          <img
            className="h-16"
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb0f59404dbfe4720b7475114d61a6db6"
            alt="Fyers"
          />
        )}
      </div>
      <div>
        <Dropdown
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
        />
      </div>
    </div>
  );
}

export default Header;
