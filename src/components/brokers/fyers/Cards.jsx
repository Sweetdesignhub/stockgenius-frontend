import React from "react";

function Cards({ title, value, valueColor, bgColor, width = "min-w-[160px]", height = "min-h-24" }) {
  return (
    <div
      className={`border rounded-xl py-1 px-2 flex flex-col items-end justify-center ${bgColor} ${width} ${height}`}
    >
      <h1 className="font-semibold">{title}</h1>
      <h1 className={`font-bold text-xl ${valueColor}`}>{value}</h1>
    </div>
  );
}

export default Cards;
