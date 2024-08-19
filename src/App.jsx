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
import AITradingBots from "./pages/india/AITradingBots";

function MainApp() {
  return (
    <div className="flex flex-col min-h-screen">
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
              <Route path="/india/portfolio" element={<IndiaPortfolio />} />
              <Route path="/india/notifications" element={<Notifications />} />
              <Route path="/india/profile" element={<Profile />} />
              <Route path="/india/brokerage" element={<Brokerage />} />
              <Route path="/india/AI-Trading-Bots" element={<AITradingBots/>} />


              {/* USA routes */}
              <Route path="/usa/dashboard" element={<UsaDashboard />} />
              <Route path="/usa/stock-lists" element={<StockLists />} />
              <Route path="/usa/referrals" element={<Referral />} />
              <Route path="/usa/portfolio" element={<UsaPortfolio />} />
              <Route path="/usa/notifications" element={<Notifications />} />
              <Route path="/usa/profile" element={<Profile />} />
              <Route path="/usa/brokerage" element={<Brokerage />} />
            </Route>
          </Routes>
        </div>
    </div>
  );
}

export default MainApp;
