import React from "react";
import imgs from "../../assets/InfoCardImageSGAI.jpg";
import { useTheme } from "../../contexts/ThemeContext";

const InfoCard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative h-full rounded-xl overflow-hidden w-full mx-auto border ${
        isDark ? "bg-white/5 border-white/10 text-white" : "bg-white text-black"
      }`}
    >
      {/* Background Image Layer */}
      <img
        src={imgs}
        alt="Background"
        className={`absolute right-0 top-24 rounded-xl h-[80%] w-80 object-cover scale-105 ${
          isDark ? "opacity-80 blur-[1px]" : "opacity-70 blur-[0.5px]"
        }`}
      />

      {/* Glass-like Overlay Content */}
      <div className="relative z-10 flex flex-row p-6 w-full">
        <div className="flex flex-col h-full justify-between items-start w-full">
          <h2 className="text-2xl font-bold">
            It is not just a tool. It is your trading machine
          </h2>

          {/* Divider */}
          <div
            className={`h-px mt-6 w-full mb-6 ${
              isDark ? "bg-white/20" : "bg-black/20"
            }`}
          ></div>

          {/* Description */}
          <div className="flex-1 flex items-center">
            <p className="text-xl mt-40 text-green-500">
              Try now and see your past or future potential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
