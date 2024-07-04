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
import Dashboard from "./pages/Dashboard";
import Header from "./components/header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import NSE100AiInsights from "./pages/NSE100AiInsights";
import Notifications from "./pages/Notifications";
import Referral from "./pages/Referral";
import Portfolio from "./pages/Portfolio";
import Brokerage from "./pages/Brokerage";

function MainApp() {
  const [country, setCountry] = useState("");

  useEffect(() => {
    const storedCountry = localStorage.getItem("country");
    if (storedCountry) {
      setCountry(storedCountry);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn setCountry={setCountry} />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              {/* India routes */}
              <Route path="/india/dashboard" element={<Dashboard />} />
              <Route path="/india/NSE100-ai-insights" element={<NSE100AiInsights />} />
              <Route path="/india/referrals" element={<Referral />} />
              <Route path="/india/portfolio" element={<Portfolio />} />
              <Route path="/india/notifications" element={<Notifications />} />
              <Route path="/india/profile" element={<Profile />} />
              <Route path="/india/brokerage" element={<Brokerage/>} />

              {/* US routes */}
              <Route path="/us/dashboard" element={<Dashboard />} />
              <Route path="/us/NSE100-ai-insights" element={<NSE100AiInsights />} />
              <Route path="/us/referrals" element={<Referral />} />
              <Route path="/us/portfolio" element={<Portfolio />} />
              <Route path="/us/notifications" element={<Notifications />} />
              <Route path="/us/profile" element={<Profile />} />
              <Route path="/us/brokerage" element={<Brokerage/>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default MainApp;
