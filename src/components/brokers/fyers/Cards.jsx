import React from "react";

function Cards({ title, value, valueColor, bgColor, width = "min-w-[160px]", height = "min-h-24", isAccountInfo = false }) {
  return (
    <div      className={`rounded-xl ${isAccountInfo ? 'py-3 px-4 shadow-lg backdrop-blur-sm' : 'py-1 px-2'} flex flex-col items-end justify-center ${bgColor} ${width} ${height}`}
      style={isAccountInfo ? {
        background: `linear-gradient(180deg, rgba(46, 51, 90, 0.1) 0%, rgba(28, 27, 51, 0.02) 100%),
                    radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
        border: '1px solid #FFFFFF33'
      } : undefined}
    >
      <h1 className={`font-semibold ${isAccountInfo ? 'text-gray-600 dark:text-gray-300' : ''}`}>{title}</h1>
      <h1 className={`font-bold text-xl ${valueColor}`}>{value}</h1>
    </div>
  );
}

export default Cards;
