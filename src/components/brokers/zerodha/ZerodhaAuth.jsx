import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config.js";

const ZerodhaAuthButton = () => {
    const navigate = useNavigate();

    const handleZerodhaAuth = async () => {
        try {
            const response = await api.get("/api/v1/zerodha/generateAuthCodeUrl");
            const { authCodeURL } = response.data;
            window.location.href = authCodeURL;
        } catch (error) {
            console.error("Failed to retrieve Zerodha auth URL:", error);
        }
    };

    const generateAccessToken = async (requestToken) => {
        try {
            const response = await api.post("/api/v1/zerodha/generateAccessToken", {
                uri,
            });
            const { accessToken } = response.data;
            localStorage.setItem("zerodha_access_token", accessToken);
            navigate("/portfolio");
        } catch (error) {
            console.error("Failed to generate access token:", error);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const requestToken = query.get("request_token");
        if (requestToken) {
            const uri = window.location.href;
            generateAccessToken(uri);
        }
    }, []);

    return <button onClick={handleZerodhaAuth}>Authenticate with Zerodha</button>;
};

export default ZerodhaAuthButton;