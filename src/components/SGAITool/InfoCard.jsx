import React from "react";
import imgs from "../../assets/InfoCardImageSGAI.png";
import { useTheme } from "../../contexts/ThemeContext";

const InfoCard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative h-full rounded-xl text-white overflow-hidden w-full mx-auto border shadow-2xl ${
        isDark
          ? "bg-white/5 border-white/10 "
          : "bg-[linear-gradient(90deg,#141B2D_4.98%,#202F56_23.34%,#2D4683_43.88%,#2D4683_67.48%,#22345F_81.9%,#111829_95.89%)] text-black"
      }`}
    >
      {/* Background Image Layer */}
      <img
        src={imgs}
        alt="Background"
        className={`absolute right-0 h-full w-80 object-cover rounded-xl`}
        style={{ background: "transparent" }}
      />

      {/* Glass-like Overlay Content */}
      <div className="relative z-10 flex flex-row p-6 w-full">
        <div className="flex flex-col h-full justify-between items-start w-full">
          <h2 className="font-poppins font-semibold text-[28px] leading-none tracking-[0.03em]">
            It is not just a tool. It is your trading machine
          </h2>

          {/* Description */}
          <div className="flex-1 flex items-center">
            <p className="font-poppins font-normal text-[24px] leading-none tracking-[0.03em] w-[70%] mt-32 text-green-500">
              Try now and see your past or future potential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
