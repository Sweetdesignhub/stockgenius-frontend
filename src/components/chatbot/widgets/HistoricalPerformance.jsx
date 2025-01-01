import React from "react";

const HistoricalPerformance = ({ performanceData }) => {
  // console.log("HistoricalPerformance Data:", performanceData);

  if (!performanceData || performanceData.length === 0) return <div>No Data Available</div>;

  const formattedData = performanceData.map((item) => ({
    date: item.Date,
    closePrice: item.Close.toFixed(2), // Round off close price
  }));

  return (
    <div className="performance p-6 bg-white text-white rounded-lg shadow-lg">
      {/* <h3 className="text-2xl font-semibold mb-4">
        Historical Performance for {performanceData[0].Ticker}
      </h3> */}
      <div className="space-y-4">
        {formattedData.map((data, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-medium">{data.date}</span>
            <span>{data.closePrice} INR</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalPerformance;
