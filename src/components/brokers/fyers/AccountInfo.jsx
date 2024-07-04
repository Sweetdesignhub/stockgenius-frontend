// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading.jsx";
// import Cards from "./Cards.jsx";
// import {
//   fetchProfile,
//   fetchHoldings,
//   fetchFunds,
//   fetchPositions,
// } from "./api.js";

// function AccountInfo() {
//   const [profile, setProfile] = useState(null);
//   console.log(profile);
//   const [holdings, setHoldings] = useState([]);
//   console.log(holdings);
//   const [funds, setFunds] = useState(null);
//   const [positions, setPositions] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profileData = await fetchProfile();
//         setProfile(profileData);

//         const holdingsData = await fetchHoldings();
//         setHoldings(holdingsData.holdings);

//         const fundsData = await fetchFunds();
//         const availableBalance = fundsData.fund_limit.find(
//           (item) => item.title === "Available Balance"
//         );
//         setFunds(availableBalance?.equityAmount || 0);

//         const positionsData = await fetchPositions();
//         const positionsPL = positionsData.overall.pl_total;
//         setPositions(positionsPL);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <Loading />;
//   }

//   if (!profile) {
//     return (
//       <p className="text-center p-3">
//         No profile data available. You need to select your broker...
//       </p>
//     );
//   }

//   const holdingsTotalPL = holdings.reduce(
//     (total, holding) => total + holding.pl,
//     0
//   );

//   return (
//     <div className="flex items-center justify-between py-5">
//       <div className="flex-1">
//         <div className="flex flex-col">
//           <h1 className="font-semibold">Account: {profile.data.fy_id}</h1>
//           <p>{profile.data.name}</p>
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-around">
//           <Cards
//             title="Funds Available"
//             value={funds.toFixed(2)}
//             valueColor="text-green-500"
//           />
//           <Cards
//             title="Holdings P&L"
//             value={holdingsTotalPL.toFixed(2)}
//             valueColor="text-orange-500"
//           />
//           <Cards
//             title="Positions P&L"
//             value={positions.toFixed(2)}
//             valueColor="text-red-500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccountInfo;

// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading.jsx";
// import Cards from "./Cards.jsx";
// import api from "../../../config.js";

// function AccountInfo() {
//   const [profile, setProfile] = useState(null);
//   const [holdings, setHoldings] = useState([]);
//   const [funds, setFunds] = useState(0);
//   const [positions, setPositions] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profileResponse = await api.get("/api/v1/fyers/fetchProfile");
//         setProfile(profileResponse.data);

//         const holdingsResponse = await api.get("/api/v1/fyers/fetchHoldings");
//         setHoldings(holdingsResponse.data.holdings);

//         const fundsResponse = await api.get("/api/v1/fyers/fetchFunds");
//         const availableBalance = fundsResponse.data.fund_limit.find(
//           (item) => item.title === "Available Balance"
//         );
//         setFunds(availableBalance?.equityAmount || 0);

//         const positionsResponse = await api.get("/api/v1/fyers/fetchPositions");
//         const positionsPL = positionsResponse.data.overall.pl_total;
//         setPositions(positionsPL);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <Loading />;
//   }

//   if (!profile) {
//     return (
//       <p className="text-center p-3">
//         No profile data available. You need to select your broker...
//       </p>
//     );
//   }

//   const holdingsTotalPL = holdings.reduce(
//     (total, holding) => total + holding.pl,
//     0
//   );

//   return (
//     <div className="flex items-center justify-between py-5">
//       <div className="flex-1">
//         <div className="flex flex-col">
//           <h1 className="font-semibold">Account: {profile.data.fy_id}</h1>
//           <p>{profile.data.name}</p>
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-around">
//           <Cards
//             title="Funds Available"
//             value={funds.toFixed(2)}
//             valueColor="text-green-500"
//           />
//           <Cards
//             title="Holdings P&L"
//             value={holdingsTotalPL.toFixed(2)}
//             valueColor="text-orange-500"
//           />
//           <Cards
//             title="Positions P&L"
//             value={positions.toFixed(2)}
//             valueColor="text-red-500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccountInfo;

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
        if (currentUser) {
          // Fetch profile data
          const profileResponse = await api.get(`/api/v1/fyers/fetchProfile`);
          setProfile(profileResponse.data);

          // Fetch funds data
          const fundsResponse = await api.get(`/api/v1/fyers/fetchFunds/${currentUser._id}`);
          setFunds(fundsResponse.data);

          // Fetch holdings data
          const holdingsResponse = await api.get(`/api/v1/fyers/fetchHoldings/${currentUser._id}`);
          setHoldings(holdingsResponse.data);

          // Fetch positions data
          const positionsResponse = await api.get(`/api/v1/fyers/fetchPositions/${currentUser._id}`);
          setPositions(positionsResponse.data);

          // Update loading state
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
