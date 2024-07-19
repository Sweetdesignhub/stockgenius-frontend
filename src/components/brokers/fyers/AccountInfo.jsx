import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading.jsx";
import Cards from "./Cards.jsx";
import api from "../../../config.js";
import { useSelector } from "react-redux";

function AccountInfo() {
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [funds, setFunds] = useState(0);
  const [positions, setPositions] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fyersAccessToken = localStorage.getItem("fyers_access_token");
        if (currentUser && fyersAccessToken) {
          const headers = { Authorization: `Bearer ${fyersAccessToken}` };

          // Fetch profile data
          const profilePromise = api.get(`/api/v1/fyers/fetchProfile`, { headers });

          // Fetch funds data
          const fundsPromise = api.get(`/api/v1/fyers/fetchFunds`, { headers });

          // Fetch holdings data
          const holdingsPromise = api.get(`/api/v1/fyers/fetchHoldings`, { headers });

          // Fetch positions data
          const positionsPromise = api.get(`/api/v1/fyers/fetchPositions`, { headers });

          const [profileResponse, fundsResponse, holdingsResponse, positionsResponse] = await Promise.all([
            profilePromise, fundsPromise, holdingsPromise, positionsPromise
          ]);

          setProfile(profileResponse.data);
          
          const totalFunds = fundsResponse.data.fund_limit.reduce((total, fund) => total + fund.equityAmount, 0);
          setFunds(totalFunds);
          
          setHoldings(Array.isArray(holdingsResponse.data.holdings) ? holdingsResponse.data.holdings : []);
          setPositions(positionsResponse.data.overall.pl_total); // Assuming you want to display `pl_total`

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

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
          <p>Email: {profile.data.email_id}</p>
          {/* Add more profile data as needed */}
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
