// import React, { useEffect, useState } from "react";
// import "./App.css";
// import Dashboard from "./pages/Dashboard";
// import Header from "./components/header/Header";
// import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import Profile from "./pages/Profile";
// import PrivateRoute from "./components/PrivateRoute";
// import LandingPage from "./pages/LandingPage";
// import NSE100AiInsights from "./pages/NSE100AiInsights";
// import Notifications from "./pages/Notifications";
// import Referral from "./pages/Referral";
// import Portfolio from "./pages/Portfolio";
// import api from "./config";

// // const App = () => {
// //   const [authCodeURL, setAuthCodeURL] = useState("");
// //   const [accessToken, setAccessToken] = useState("");
// //   const navigate = useNavigate();

// //   const handleFyersAuth = async () => {
// //     try {
// //       const response = await api.get("/api/v1/fyers/generateAuthCodeUrl");
// //       const { authCodeURL } = response.data;
// //       window.location.href = authCodeURL;
// //     } catch (error) {
// //       console.error("Failed to retrieve Fyers auth URL:", error);
// //     }
// //   };

// //   const generateAccessToken = async (uri) => {
// //     try {
// //       const response = await api.post("/api/v1/fyers/generateAccessToken", { uri });
// //       const { accessToken } = response.data;
// //       setAccessToken(accessToken);
// //       console.log("Access Token:", accessToken);
// //       navigate("/portfolio");
// //     } catch (error) {
// //       console.error("Failed to generate access token:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     const query = new URLSearchParams(window.location.search);
// //     const authCode = query.get("auth_code");
// //     if (authCode) {
// //       const uri = window.location.href;
// //       generateAccessToken(uri);
// //     }
// //   }, []);

// //   return (
// //     <div>
// //       <button onClick={handleFyersAuth}>Authenticate with Fyers</button>
// //     </div>
// //   );
// // };

// function MainApp() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <BrowserRouter>
//         <Header />
//         <div className="flex-grow">
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/sign-in" element={<SignIn />} />
//             <Route path="/sign-up" element={<SignUp />} />
//             <Route element={<PrivateRoute />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/NSE100-ai-insights" element={<NSE100AiInsights />} />
//               <Route path="/referrals" element={<Referral/>}/>
//               <Route path="/portfolio" element={<Portfolio/>}/>
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default MainApp;

import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Notifications from "./pages/Notifications";
import Referral from "./pages/Referral";
import IndiaPortfolio from "./pages/india/IndiaPortfolio";
import Brokerage from "./pages/Brokerage";
import IndiaDashboard from "./pages/india/IndiaDashboard";
import UsaDashboard from "./pages/usa/UsaDashboard";
import NSE100AiInsights from "./pages/india/NSE100AiInsights";
import StockLists from "./pages/usa/StockLists";
import UsaPortfolio from "./pages/usa/UsaPortfolio";
import Sample from "./pages/Sample";

function MainApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              {/* India routes */}
              <Route path="/india/dashboard" element={<IndiaDashboard />} />
              <Route
                path="/india/NSE100-ai-insights"
                element={<NSE100AiInsights />}
              />
              <Route path="/india/referrals" element={<Referral />} />
              <Route path="/india/portfolio" element={<IndiaPortfolio/>} />
              <Route path="/india/notifications" element={<Notifications />} />
              <Route path="/india/profile" element={<Profile />} />
              <Route path="/india/brokerage" element={<Brokerage />} />
              <Route path="/sample" element={<Sample/>} />

              {/* USA routes */}
              <Route path="/usa/dashboard" element={<UsaDashboard />} />
              <Route path="/usa/stock-lists" element={<StockLists />} />
              <Route path="/usa/referrals" element={<Referral />} />
              <Route path="/usa/portfolio" element={<UsaPortfolio/>} />
              <Route path="/usa/notifications" element={<Notifications />} />
              <Route path="/usa/profile" element={<Profile />} />
              <Route path="/usa/brokerage" element={<Brokerage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default MainApp;
