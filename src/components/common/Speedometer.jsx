import React from 'react';
import GaugeChart from 'react-gauge-chart';

const Speedometer = ({ value }) => {
  //  if value is NaN, if so, set it to zero
  if (isNaN(value)) {
    value = 0;
  }

  // Map the input value (-1 to 1) to the gauge chart range (0 to 1)
  const mappedValue = (value + 1) / 2;

  return (
    <div className="flex items-center justify-center" style={{width:"80px", height:"60px"}}>
      <GaugeChart
        id="speedometer-chart"
        nrOfLevels={3}
        colors={["green", "orange", "red"]}
        arcPadding={0.1}
        cornerRadius={1}
        percent={mappedValue}
        needleColor="black"
        // textColor="black"
        // hideText={true} 
        arcWidth={0.3}
      />
    </div>
  );
};

export default Speedometer;
