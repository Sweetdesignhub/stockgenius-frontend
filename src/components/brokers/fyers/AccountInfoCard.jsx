import React from "react";

function AccountInfoCard({ title, value, valueColor }) {
  return (
    <div
      className="rounded-[10px] shadow-lg backdrop-blur-sm flex flex-col items-center sm:items-end justify-center w-full py-1 px-2 sm:py-[6px] sm:px-3 md:py-1 md:px-2 sm:w-[150px] md:w-[180px] lg:w-[159px] min-w-[120px] sm:min-w-[150px] lg:min-w-[159px] h-[88px] sm:h-[80px] lg:h-[88px] transition-all duration-300 shrink-0"
      style={{
        background: `linear-gradient(180deg, rgba(46, 51, 90, 0.1) 0%, rgba(28, 27, 51, 0.02) 100%),
                    radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
        border: '1px solid #FFFFFF33'
      }}
    >
      <h1 className="font-semibold text-sm text-gray-600 dark:text-gray-300">{title}</h1>
      <h1 className={`font-bold text-lg ${valueColor}`}>{value}</h1>
    </div>
  );
}

export default AccountInfoCard;
