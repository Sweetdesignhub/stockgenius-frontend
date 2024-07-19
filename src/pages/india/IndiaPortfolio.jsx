import React, { useState, useEffect } from "react";
import AccountInfo from "../../components/brokers/fyers/AccountInfo";
import Header from "../../components/brokers/fyers/Header";
import StockDetails from "../../components/brokers/fyers/portfolio/StockDetails";
import api from "../../config";

function IndiaPortfolio() {
  const [fyersAccessToken, setFyersAccessToken] = useState(localStorage.getItem("fyers_access_token"));
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authCode = query.get("auth_code");

    const generateAccessToken = async (uri) => {
      try {
        const response = await api.post("/api/v1/fyers/generateAccessToken", {
          uri,
        });
        const { accessToken } = response.data;
        localStorage.setItem("fyers_access_token", accessToken);
        setFyersAccessToken(accessToken);
      } catch (error) {
        console.error("Failed to generate access token:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    if (authCode) {
      const uri = window.location.href;
      generateAccessToken(uri);
    } else {
      setIsAuthenticating(false);
    }
  }, []);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="bear"
        />

        <div className="bg-white min-h-[85vh] news-table rounded-2xl">
          <div className="py-5 px-5 flex flex-col rounded-2xl">
            {fyersAccessToken ? (
              <div>
                <Header />
                <AccountInfo />
                <StockDetails />
              </div>
            ) : (
              <div>
                <Header />
                <StockDetails />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndiaPortfolio;
