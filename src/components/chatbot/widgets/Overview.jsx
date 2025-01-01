// import Options from "./Options";

// const GeneralOptions = (props) => {
//   const options = [
//     {
//       name: "Show Relevant News",
//       handler: props.actionProvider.handleRelevantNews,
//       id: 1
//     },
//     {
//       name: "Show Profile Analysis",
//       handler: props.actionProvider.handleProfileAnalysis,
//       id: 2
//     },
//     {
//       name: "Show Historical Performance",
//       handler: props.actionProvider.handleHistoricalPerformance,
//       id: 3
//     }
//   ];
//   return <Options options={options} title="Options" {...props} />;
// };

// export default GeneralOptions;


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
      id: 2
    },
        {
      name: "Show Historical Performance",
      handler: props.actionProvider.askForTickerHistoricalPerformance ,
      id: 3
    }
  ];

  return (
    <div className="options">
      {/* <h3>Options</h3> */}
      {options.map((option) => (
        <button key={option.id} onClick={option.handler}>
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default Overview;
