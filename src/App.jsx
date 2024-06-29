import React from "react";
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

function App() {
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/NSE100-ai-insights" element={<NSE100AiInsights />} />
              <Route path="/referrals" element={<Referral/>}/>
              <Route path="/portfolio" element={<Portfolio/>}/>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;


// import React from 'react';
// import TradeComponent from './components/TradeComponent';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// const App = () => {
//   return (
//     <Router>
//       <div className="App">
//         <header className="App-header">
//           <h1>Trading Platform</h1>
//           <Routes>
//             <Route path="/" exact component={TradeComponent} />
//             <Route path="/callback" component={TradeComponent} />
//           </Routes>
//         </header>
//       </div>
//     </Router>
//   );
// };

// export default App;
