import React, { useEffect, useState } from "react";
import api from "../config.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState(null);
  const [orders, setOrders] = useState(null);

  console.log(holdings);
  console.log(orders);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/fetchProfile");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    const fetchHoldings = async () => {
      try {
        const response = await api.get("/fetchHoldings");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch holdings:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get("/getOrders");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchProfile();
    fetchHoldings();
    fetchOrders();
  }, []);

  if (!profile) return <p>Loading profile & holdings...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(profile, null, 2)}</pre>

      <h1>Holdings</h1>
      <pre>{JSON.stringify(holdings, null, 2)}</pre>

      <h1>Orders</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
};

export default Profile;
