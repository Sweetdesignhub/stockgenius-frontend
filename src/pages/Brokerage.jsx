import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../config";
import BrokerDetails from "../components/brokers/BrokerDetails";
import { useNavigate } from "react-router-dom";

const Brokerage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [brokerDetails, setBrokerDetails] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadBrokerDetails(currentUser._id);
    }
  }, [currentUser]);

  const loadBrokerDetails = async (userId) => {
    try {
      const response = await api.get(
        `/api/v1/fyers/getBrokerDetails/${userId}`
      );
      setBrokerDetails(response.data);
    } catch (error) {
      console.error("Error fetching broker details:", error);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await api.put(`/api/v1/fyers/updateFyersCredentials/${id}`, formData);
      loadBrokerDetails(currentUser._id);
      window.alert("Successfully updated credentials!");
    } catch (error) {
      console.error("Error updating broker credentials:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/fyers/deleteFyersCredentials/${id}`);
      loadBrokerDetails(currentUser._id);
      window.alert("Successfully deleted credentials!");
    } catch (error) {
      console.error("Error deleting broker credentials:", error);
    }
  };

  const handleConnect = async (id) => {
    try {
      const response = await api.post(
        `/api/v1/fyers/generateAuthCodeUrl/${id}`,
        {
          userId: currentUser._id,
        }
      );
      const { authCodeURL } = response.data;
      window.location.href = `${authCodeURL}&state_id=${id}`;
    } catch (error) {
      console.error("Error generating auth code URL:", error);
    }
  };

  const generateAccessToken = async (uri, id) => {
    try {
      const response = await api.post("/api/v1/fyers/generateAccessToken", {
        uri,
        userId: currentUser._id,
        id,
      });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      // Redirect based on localStorage country setting
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
    const id = query.get("state_id");
    console.log("state_id", id);
    if (authCode && id) {
      const uri = window.location.href;
      generateAccessToken(uri, id);
    }
  }, []);

  return (
    <div className="p-6">
      {brokerDetails.length === 0 ? (
        <div className="text-center">
          <p>No brokers connected. Connect your broker.</p>
        </div>
      ) : (
        brokerDetails.map((credentials) => (
          <BrokerDetails
            key={credentials._id}
            credentials={credentials}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onConnect={handleConnect}
          />
        ))
      )}
    </div>
  );
};

export default Brokerage;
