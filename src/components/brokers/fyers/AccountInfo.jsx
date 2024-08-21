import { useEffect, useState } from "react";
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

  const fetchData = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      if (currentUser && fyersAccessToken) {
        const headers = { Authorization: `Bearer ${fyersAccessToken}` };
        const response = await api.get(
          `/api/v1/fyers/fetchAllFyersUserDetails/${currentUser._id}`,
          { headers }
        );
        const data = response.data[0];

        setProfile(data.profile);
        setFunds(data.funds.fund_limit[9]?.equityAmount || 0);
        setHoldings(data.holdings.holdings || []);
        setPositions(data.positions.overall.pl_total || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData();
      setLoading(false);
    };

    fetchAllData();

    const dataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(dataInterval);
    };
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
          <h1 className="font-semibold">Account: {profile.fy_id}</h1>
          <p>{profile.name}</p>
          <p>Email: {profile.email_id}</p>
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
