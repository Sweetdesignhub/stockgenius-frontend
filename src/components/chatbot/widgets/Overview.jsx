

import React from "react";

const Overview = (props) => {
  const options = [
    {
      name: "Show Relevant News",
      handler: props.actionProvider.askForTicker,
      id: 1,
    },
    {
      name: "Show Profile Analysis",
      handler: props.actionProvider.askForTickerProfile,
      id: 2,
    },
    {
      name: "Show Historical Performance",
      handler: props.actionProvider.askForTickerHistoricalPerformance,
      id: 3,
    },
  ];

  return (
    <div className="options">
      {options.map((option) => (
        <button key={option.id} onClick={option.handler}>
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default Overview;
