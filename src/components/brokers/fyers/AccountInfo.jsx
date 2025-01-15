import React from "react";
import Cards from "./Cards.jsx";
import { useData } from "../../../contexts/FyersDataContext.jsx";

function AccountInfo() {
  const {
    profile = {},
    holdings = {},
    funds = { fund_limit: [{}] },
    positions = { overall: {} },
    loading,
  } = useData();

  const holdingsTotalPL = holdings?.overall?.total_pl?.toFixed(2) || "0.00";
  const positionTotalPL = positions?.overall?.pl_total?.toFixed(2) || "0.00";
  const availableFunds =
    funds?.fund_limit?.[9]?.equityAmount?.toFixed(2) || "0.00";

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return (
      <p className="text-center p-3">
        No profile data available. You need to select your broker...
      </p>
    );
  }

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
            value={availableFunds}
            valueColor="text-green-500"
          />
          <Cards
            title="Holdings P&L"
            value={holdingsTotalPL}
            valueColor="text-orange-500"
          />
          <Cards
            title="Positions P&L"
            value={positionTotalPL}
            valueColor="text-red-500"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;

// import React from "react";
// import Cards from "./Cards.jsx";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";

// function AccountInfo() {
//   const { theme } = useTheme(); // Access the current theme from the context

//   // Static data to simulate a profile and account information
//   const profile = {
//     fy_id: "123456789",
//     name: "John Doe",
//     email_id: "johndoe@example.com",
//   };

//   const holdings = {
//     overall: {
//       total_pl: 1200.5, // Example P&L for holdings
//     },
//   };

//   const funds = {
//     fund_limit: [
//       { equityAmount: 5000.0 }, // Just an example value for the 10th index
//     ],
//   };

//   const positions = {
//     overall: {
//       pl_total: -150.75, // Example P&L for positions
//     },
//   };

//   const holdingsTotalPL = holdings?.overall?.total_pl?.toFixed(2) || "0.00";
//   const positionTotalPL = positions?.overall?.pl_total?.toFixed(2) || "0.00";
//   const availableFunds =
//     funds?.fund_limit?.[0]?.equityAmount?.toFixed(2) || "0.00"; // Change index if needed

//   // Conditionally set background color based on theme
//   const cardBgColor =
//     theme === "light"
//       ? "bg-white"
//       : "bg-[linear-gradient(180deg,_rgba(46,_51,_90,_0.1)_0%,_rgba(28,_27,_51,_0.02)_100%),_radial-gradient(146.13%_118.42%_at_50%_-15.5%,_rgba(255,_255,_255,_0.16)_0%,_rgba(255,_255,_255,_0)_100%)]";

//   return (
//     <div className="flex items-center justify-between py-5">
//       <div className="flex-1">
//         <div className="flex flex-col">
//           <h1 className="font-semibold">Account: {profile.fy_id}</h1>
//           <p>{profile.name}</p>
//           <p>Email: {profile.email_id}</p>
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-around">
//           <Cards
//             title="Funds Available"
//             value={availableFunds}
//             valueColor="text-green-500"
//             bgColor={cardBgColor}
//           />
//           <Cards
//             title="Holdings P&L"
//             value={holdingsTotalPL}
//             valueColor="text-orange-500"
//             bgColor={cardBgColor}
//           />
//           <Cards
//             title="Positions P&L"
//             value={positionTotalPL}
//             valueColor="text-red-500"
//             bgColor={cardBgColor}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccountInfo;
