/**
 * File: Speedometer
 * Description: A speedometer gauge component that visualizes a normalized value between -1 and 1 as a gauge chart, using `react-gauge-chart`. This component adapts text color based on the current theme and ensures a valid numeric input by setting non-numeric values to zero. The gauge features three color levels (green, orange, red) and displays a needle representing the mapped value.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */



import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { useTheme } from '../../contexts/ThemeContext';

const Speedometer = ({ value }) => {

  const { theme } = useTheme();
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
        textColor={theme === 'light' ? 'black' : 'white'}
        // hideText={true} 
        arcWidth={0.3}
      />
    </div>
  );
};

export default Speedometer;
