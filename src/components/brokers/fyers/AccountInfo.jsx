import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading.jsx";
import Cards from "./Cards.jsx";
import {
  fetchProfile,
  fetchHoldings,
  fetchFunds,
  fetchPositions,
} from "./api.js";

function AccountInfo() {
  const [profile, setProfile] = useState(null);
  console.log(profile);
  const [holdings, setHoldings] = useState([]);
  console.log(holdings);
  const [funds, setFunds] = useState([]);
  console.log(funds);
  const [positions, setPositions] = useState([]);
  console.log(positions);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const profileData = await fetchProfile();
  //       setProfile(profileData);

  //       const holdingsData = await fetchHoldings();
  //       setHoldings(holdingsData.holdings);

  //       const fundsData = await fetchFunds();
  //       const availableBalance = fundsData.fund_limit.find(
  //         (item) => item.title === "Available Balance"
  //       );
  //       setFunds(availableBalance?.equityAmount || 0);

  //       const positionsData = await fetchPositions();
  //       const positionsPL = positionsData.overall.pl_total;
  //       setPositions(positionsPL);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/v1/fyers/fetchProfile");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    const fetchHoldings = async () => {
      try {
        const response = await api.get("/api/v1/fyers/fetchHoldings");
        setHoldings(response.data);
      } catch (error) {
        console.error("Failed to fetch holdings:", error);
      }
    };

    const fetchFunds = async () => {
      try {
        const response = await api.get("/api/v1/fyers/fetchFunds");
        setFunds(response.data);
      } catch (error) {
        console.error("Failed to fetch funds:", error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await api.get("/api/v1/fyers/fetchPositions");
        setPositions(response.data);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    };

    fetchProfile();
    fetchHoldings();
    fetchFunds();
    fetchPositions();
  }, []);

  // if (loading) {
  //   return <Loading />;
  // }

  if (!profile) {
    return (
      <p className="text-center p-3">
        No profile data available. You need to select your broker...
      </p>
    );
  }

  const holdingsTotalPL = holdings.reduce(
    (total, holding) => total + holding.pl,
    0
  );

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex-1">
        <div className="flex flex-col">
          <h1 className="font-semibold">Account: {profile.data.fy_id}</h1>
          <p>{profile.data.name}</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-around">
          <Cards
            title="Funds Available"
            value={funds.toFixed(2)}
            valueColor="text-green-500"
          />
          <Cards
            title="Holdings P&L"
            value={holdingsTotalPL.toFixed(2)}
            valueColor="text-orange-500"
          />
          <Cards
            title="Positions P&L"
            value={positions.toFixed(2)}
            valueColor="text-red-500"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
