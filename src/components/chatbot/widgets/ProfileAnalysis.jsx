import React from "react";

const ProfileAnalysis = ({ profileData }) => {
  // If there's no profile data, don't render anything.
  if (!profileData) return null;

  return (
    <div className="profile-analysis bg-[#04668a] p-2 text-sm rounded-lg shadow-lg text-white hover:bg-[#035d6f] transition-all duration-300">
      <div className="">
        <p className="">
          ROI (Return on Investment): {(profileData.ROI * 100).toFixed(2)}%
        </p>
      </div>
      <div className="">
        <p className="">Volatility: {profileData.Volatility}</p>
      </div>
      <div className="">
        <p className="">
          Sentiment Score: {profileData["Sentiment Score"]}
        </p>
      </div>
      <div>
        <p className="">
          RSI (Relative Strength Index): {profileData.RSI}
        </p>
      </div>
    </div>
  );
};

export default ProfileAnalysis;
