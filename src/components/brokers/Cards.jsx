import React from "react";

function Cards({ title, value, valueColor }) {
  return (
    <div className="border rounded-xl p-4 min-h-24 min-w-[160px] flex flex-col items-end  justify-center">
      <h1 className="font-semibold">{title}</h1>
      <h1 className={`font-bold text-xl ${valueColor}`}>{value}</h1>
    </div>
  );
}

export default Cards;
