import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import PricingDialog from "./components/pricing/PricingDialog";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute.jsx";
import Header from "./components/header/Header";
import Brokerage from "./pages/Brokerage";
import LandingPage from "./pages/LandingPage";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Referral from "./pages/Referral";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AITradingBots from "./pages/india/AITradingBots";
import IndiaDashboard from "./pages/india/IndiaDashboard";
import IndiaPortfolio from "./pages/india/IndiaPortfolio";
import NSE100AiInsights from "./pages/india/NSE100AiInsights";
import StockLists from "./pages/usa/StockLists";
import UsaDashboard from "./pages/usa/UsaDashboard";
import UsaPortfolio from "./pages/usa/UsaPortfolio";
import ForgotPassword from "./components/common/ForgotPassword";
import ResetPassword from "./components/common/ResetPassword";
import CompleteProfile from "./pages/CompleteProfile";

import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken, BACKEND_URL } from "./config.js";
import api from "./config";
import { clearRegion } from "./redux/region/regionSlice.js";
import { clearFyersAccessToken } from "./redux/brokers/fyersSlice.js";
import { signOut } from "./redux/user/userSlice.js";
import SessionExpiredModal from "./components/common/SessionExpiredModal";
import InitialPublicOffers from "./pages/india/InitialPublicOffers.jsx";
import CreateIpos from "./pages/india/CreateIpos.jsx";
import PaperTrading from "./pages/india/PaperTrading.jsx";
import ChatbotComponent from "./components/common/Chatbot.jsx";
import PaperTradingPortfolio from "./pages/india/PaperTradingPortfolio.jsx";
import PaperTradingAutoTrade from "./pages/india/PaperTradingAutoTrade.jsx";
import BankNifty from "./pages/india/BankNifty.jsx";
import UsaPaperTrading from "./pages/usa/UsaPaperTrading.jsx";
import UsaPaperTradingPortfolio from "./pages/usa/UsaPaperTradingPortfolio.jsx";
import ELearning from "./pages/ELearning.jsx";
import QuizPage from "./pages/eLearning/QuizPage.jsx";
import LearningTab from "./pages/eLearning/LearningTab.jsx";
import MedalTab from "./pages/eLearning/MedalTab.jsx";
import ModuleDetails from "./components/eLearning/ModuleDetails.jsx";
import TrophyTab from "./pages/eLearning/TrophyTab.jsx";
import LibraryTab from "./pages/eLearning/LibraryTab.jsx";
import GroupTab from "./pages/eLearning/GroupTab.jsx";
import SGAITool from "./pages/SGAITool";
import SuccessPayment from "./components/pricing/SuccessPayment.jsx";
import FailedPayment from "./components/pricing/FailedPayment.jsx";
import PlanSelectDialog from "./components/pricing/PlanSelectDialog.jsx";
import Dashboard from "./components/pricing/Dashboard.jsx";
import { setShowPlanSelectDialog } from "./redux/pricing/pricingSlice";

// Add AuthRoute at the top of the file after other imports
const AuthRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  if (currentUser) {
    const region = localStorage.getItem("region") || "india";
    return (
      <Navigate
        to={`/${region}/dashboard`}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

function MainApp() {
  // console.log("Azure Storage Account Name:", import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME);

  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const showPlanSelectDialog = useSelector(
    (state) => state.pricing.showPlanSelectDialog
  );
  const region = useSelector((state) => state.region);

  // Effect to show pricing dialog after login/signup
  useEffect(() => {
    // Don't show dialog if user is coming from payment pages
    const isFromPayment = location.pathname.includes("/payment/");

    if (
      currentUser &&
      (!currentUser.plan || currentUser.plan === "basic") &&
      !isFromPayment
    ) {
      // Get the timestamp of when user logged in
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      const now = new Date().getTime();

      // Only show if user just logged in (within last 5 seconds)
      if (loginTimestamp && now - parseInt(loginTimestamp) < 5000) {
        const timer = setTimeout(() => {
          setShowPricingDialog(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentUser, location.pathname]);

  const handleSignOut = async () => {
    try {
      await api.post("/api/v1/auth/sign-out");
      dispatch(clearRegion());
      dispatch(clearFyersAccessToken());
      dispatch(signOut());
      window.location.href = "/sign-in"; // Redirect to sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleSessionExpired = () => {
    setShowSessionExpired(true);
  };

  useEffect(() => {
    // console.log("Checking");
    const publicRoutes = [
      "/",
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/complete-profile",
    ];
    const isResetPasswordRoute =
      location.pathname.startsWith("/reset-password");

    const shouldCheckSession =
      !publicRoutes.includes(location.pathname) && !isResetPasswordRoute;

    if (!shouldCheckSession) return;

    window.addEventListener("sessionExpired", handleSessionExpired);

    const verifyTokens = async () => {
      console.log("Verifying");
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-token`, {
          method: "POST",
          credentials: "include", // ✅ Ensures cookies like HTTP-only tokens are sent
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("output from req", res.status);
        if (res.status !== 200) {
          console.log("Token Expired");
          handleSessionExpired();
        }

        // else {
        //   updateUser(res.data.user);
        // }
      } catch (err) {
        console.log("Token Check failed");
        handleSessionExpired(); // token check failed or server error
      }
    };

    verifyTokens();

    // 🧼 Optional cleanup
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };

    // Listen for session expiration (if using a global event or state management)
    window.addEventListener("sessionExpired", handleSessionExpired);

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  // ✅ Hide Header on specific routes like /quiz/*
  const hideHeaderOnRoutes = ["/quiz/"];
  const shouldHideHeader = hideHeaderOnRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // Pages where chatbot should appear
  const chatbotPages = ["/india/dashboard"];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!shouldHideHeader && <Header />}
      <main className="flex-1 overflow-scroll scrollbar-hide">
        <Routes>
          {/* Auth routes - these should be first to ensure they take precedence */}
          <Route element={<AuthRoute />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="complete-profile" element={<CompleteProfile />} />
          </Route>

          {/* Public route */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            {/* common route */}

            <Route path="/e-learning" element={<ELearning />}>
              <Route index element={<Navigate to="learning" replace />} />
              <Route path="learning" element={<LearningTab />}>
                {/* Nested route for module details */}
                <Route path=":moduleId" element={<ModuleDetails />} />
              </Route>
              <Route path="medal" element={<MedalTab />} />
              <Route path="trophy" element={<TrophyTab />} />
              <Route path="library" element={<LibraryTab />} />
              <Route path="group" element={<GroupTab />} />
            </Route>
            <Route path="/quiz/module/:moduleId" element={<QuizPage />} />
            <Route path="/backtesting-tool" element={<SGAITool />} />
            <Route path="/pricing" element={<PlanSelectDialog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment/success" element={<SuccessPayment />} />
            <Route path="/payment/cancel" element={<FailedPayment />} />
            {/* sgai-tool */}
            {/* India routes */}
            <Route path="/india/dashboard" element={<IndiaDashboard />} />
            <Route
              path="/india/NSE100-ai-insights"
              element={<NSE100AiInsights />}
            />
            <Route path="/india/bankNifty" element={<BankNifty />} />
            <Route path="/india/referrals" element={<Referral />} />
            <Route path="/india/portfolio" element={<IndiaPortfolio />} />
            <Route path="/india/notifications" element={<Notifications />} />
            <Route path="/india/profile" element={<Profile />} />
            <Route path="/india/brokerage" element={<Brokerage />} />
            <Route path="/india/AI-Trading-Bots" element={<AITradingBots />} />
            <Route
              path="/india/initial-public-offers"
              element={<InitialPublicOffers />}
            />
            <Route path="/india/paper-trading" element={<PaperTrading />} />
            <Route
              path="/india/paper-trading/portfolio"
              element={<PaperTradingPortfolio />}
            />
            <Route
              path="/india/paper-trading/auto-trade"
              element={<PaperTradingAutoTrade />}
            />

            {/* admin route */}
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/india/admin-create-ipos" element={<CreateIpos />} />
            </Route>

            {/* USA routes */}
            <Route path="/usa/dashboard" element={<UsaDashboard />} />
            <Route path="/usa/stock-lists" element={<StockLists />} />
            <Route path="/usa/referrals" element={<Referral />} />
            <Route path="/usa/portfolio" element={<UsaPortfolio />} />
            <Route path="/usa/notifications" element={<Notifications />} />
            <Route path="/usa/profile" element={<Profile />} />
            <Route path="/usa/brokerage" element={<Brokerage />} />
            <Route path="/usa/paper-trading" element={<UsaPaperTrading />} />
            <Route
              path="/usa/paper-trading/portfolio"
              element={<UsaPaperTradingPortfolio />}
            />
            <Route
              path="/usa/paper-trading/auto-trade"
              element={<PaperTradingAutoTrade />}
            />
          </Route>
        </Routes>
      </main>{" "}
      <SessionExpiredModal
        showModal={showSessionExpired}
        onSignOut={handleSignOut}
      />
      {currentUser && <ChatbotComponent />}
      {currentUser && (
        <>
          <PricingDialog
            isOpen={showPricingDialog}
            onClose={() => setShowPricingDialog(false)}
            currentPlan={currentUser?.plan || "basic"}
          />
          <PlanSelectDialog
            isOpen={showPlanSelectDialog}
            onClose={() => dispatch(setShowPlanSelectDialog(false))}
            currentPlan={currentUser?.plan || "basic"}
          />
        </>
      )}
    </div>
  );
}

export default MainApp;
