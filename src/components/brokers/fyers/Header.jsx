import React, { useEffect, useState } from "react";
import Dropdown from "../../common/Dropdown";
import { useNavigate } from "react-router-dom";
import api from "../../../config";

function Header() {
  const [selectedOption, setSelectedOption] = useState("");
  const [authCodeURL, setAuthCodeURL] = useState("");
  const [accessToken, setAccessToken] = useState("");
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
      setAccessToken(accessToken);
      console.log("Access Token:", accessToken);
      navigate("/portfolio");
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
    <div className="flex justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold">Account Manager</h1>
      <div>
            <button onClick={handleFyersAuth}>Authenticate with Fyers</button>
          </div>
      <div className="max-h-10">
        {selectedOption === "Fyers" && (
          <img
            className="h-16"
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb0f59404dbfe4720b7475114d61a6db6"
            alt="Fyers"
          />
        )}
        {selectedOption === "Zerodha" && (
          <img
            className="h-8"
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd314830a17a84ee5956be4ca2cee3c5a"
            alt="Zerodha"
          />
        )}
        {selectedOption === "Motilal Oswal" && (
          <img
            className="h-10"
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fe9a3e857c17e41ceac69d3e2acc20695"
            alt="Motilal Oswal"
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
