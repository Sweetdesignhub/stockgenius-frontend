/**
 * File: TradeRatioBar
 * Description: A reusable component used in the AI trading webpage to display a visual bar representing the ratio of green (positive) and red (negative) percentages.
 * It dynamically adjusts the width of the bars based on the provided ratio.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Added functionality to dynamically calculate and display green and red percentage bars based on the input ratio.
 */



import React from 'react'

function TradeRatioBar({ ratio }) {

    const percentage = isNaN(parseFloat(ratio)) ? 0 : parseFloat(ratio);
    const greenPercentage = percentage.toFixed(1);
    const redPercentage = (100 - percentage).toFixed(1);

  return (
      <div className="w-full max-w-[6rem] min-w-[4rem]">
        <div className="flex justify-between mb-[2px]">
          <span className="text-[#00FF47] font-semibold text-[9px]">
            {greenPercentage}%
          </span>
          <span className="text-[#FF0000] font-semibold text-[9px]">
            {redPercentage}%
          </span>
        </div>
        <div className="w-full h-1 flex rounded-full overflow-hidden">
          <div
            style={{ width: `${greenPercentage}%` }}
            className="h-full bg-[#00FF47]"
          ></div>
          <div
            style={{ width: `${redPercentage}%`, backgroundColor: "#FF0000" }}
            className="h-full"
          ></div>
        </div>
      </div>
    );
}

export default TradeRatioBar
