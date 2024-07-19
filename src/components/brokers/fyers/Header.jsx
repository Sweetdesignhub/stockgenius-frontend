// src/components/header/Header.jsx

import React, { useEffect, useState } from "react";
import Dropdown from "../../common/Dropdown";
import { useNavigate } from "react-router-dom";
import api from "../../../config";

function Header() {
  const [selectedOption, setSelectedOption] = useState("Fyers");
  const [authCodeURL, setAuthCodeURL] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // localStorage.setItem("fyers_access_token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjE0MTYzNTMsImV4cCI6MTcyMTQzNTQzMywibmJmIjoxNzIxNDE2MzUzLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbW1ycWhSb29yd3poenJLWmVJblQ0d21yT0JkVXI0cEhiNm1pbU1uTGI4U2NDM3QwWEtBaUg4dHNuTVRuVWNWekIyZ0QtR19kN2h5NXk5a090T3FwWmdGOWhzcDNzMFFER0sxbzM0UUpnb29nTDJJRT0iLCJkaXNwbGF5X25hbWUiOiJBU1dJTkkgR0FKSkFMQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6ImQ5NWQ0MTZmNDc2ZmFiZmUzNzVjMDFiOTA3ZTIwMjc2OTEwNTJiNzZhZmI5OTQ0ZjIwMjA1ZjJlIiwiZnlfaWQiOiJZQTE0MjIxIiwiYXBwVHlwZSI6MTAyLCJwb2FfZmxhZyI6Ik4ifQ.MrmC98yb8E_IfufIUPpNTaOQ1WdR62WTH6GQCpH-SoA");

  const fyersAccessToken = localStorage.getItem("fyers_access_token");

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
      // console.log("Access Token:", accessToken);
      localStorage.setItem(
        "fyers_access_token",
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjE0MTYzNTMsImV4cCI6MTcyMTQzNTQzMywibmJmIjoxNzIxNDE2MzUzLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbW1ycWhSb29yd3poenJLWmVJblQ0d21yT0JkVXI0cEhiNm1pbU1uTGI4U2NDM3QwWEtBaUg4dHNuTVRuVWNWekIyZ0QtR19kN2h5NXk5a090T3FwWmdGOWhzcDNzMFFER0sxbzM0UUpnb29nTDJJRT0iLCJkaXNwbGF5X25hbWUiOiJBU1dJTkkgR0FKSkFMQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6ImQ5NWQ0MTZmNDc2ZmFiZmUzNzVjMDFiOTA3ZTIwMjc2OTEwNTJiNzZhZmI5OTQ0ZjIwMjA1ZjJlIiwiZnlfaWQiOiJZQTE0MjIxIiwiYXBwVHlwZSI6MTAyLCJwb2FfZmxhZyI6Ik4ifQ.MrmC98yb8E_IfufIUPpNTaOQ1WdR62WTH6GQCpH-SoA"
      );
      localStorage.setItem("fyers_access_token", accessToken);
      navigate("/india/portfolio");
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
      <div className="flex items-center">
        <div className="max-h-10">
          {selectedOption === "Fyers" && (
            <div className="flex items-center">
              <img
                className="h-16"
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb0f59404dbfe4720b7475114d61a6db6"
                alt="Fyers"
              />
            </div>
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
      </div>
      <div>
        {/* <Dropdown
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
        /> */}

        {fyersAccessToken ? (
          ""
        ) : (
          <button
            onClick={handleFyersAuth}
            className="auth px-4 py-1 mb-4"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Fyers"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
