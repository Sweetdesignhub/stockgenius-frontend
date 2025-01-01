import React from "react";

const TickerInfoCard = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-100">
      <h3 className="text-lg font-bold">Ticker Information</h3>
      <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TickerInfoCard;
