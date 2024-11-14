/**
 * File: Table
 * Description: The Table component is a reusable and flexible table structure designed to display tabular data with customizable columns, dynamic button actions, and styling. It renders a list of data with specific column values, as well as a decision column with an action button for each row. The component also adjusts its appearance and layout based on the user's region, which is stored in the browser's local storage and managed in the Redux state.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React from "react";
import Speedometer from "../common/Speedometer";
import { useSelector } from "react-redux";

function Table({
  title,
  data,
  columns,
  buttonLabel,
  buttonAction,
  buttonColor,
  actionButtonColor,
  roiColor,
}) {
  const region = localStorage.getItem("region");

  const stateRegion = useSelector((state) => state.region);

  let maxHeight;
  if (region === "india" && stateRegion === "india") {
    // maxHeight = "calc(70vh - 8rem)";
    maxHeight = "62vh";
  } else if (region === "usa" && stateRegion === "usa") {
    maxHeight = "80vh";
  } else {
    maxHeight = ""; // default or other condition
  }

  return (
    <div className="flex-1 overflow-auto rounded-xl">
      <div className="flex justify-between pb-2 border-b border-gray-500">
        <button
          className={`py-1 px-5 rounded-2xl bg-white font-bold ${buttonColor}`}
        >
          {buttonLabel}
        </button>
        <h2 className="font-semibold text-lg font-[poppins]">{title}</h2>
      </div>

      <div
        className="overflow-scroll p-4 flex max-h-[80vh] news-table rounded-xl mt-4"
        style={{ maxHeight }}
        // style={{ maxHeight: "calc(70vh - 8rem)" }}
      >
        <div className="lg:max-w-[85%] max-w-[75%]">
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-transparent">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="w-full px-2 text-left py-3 text-xs font-medium tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => {
                      const getClassNames = () => {
                        if (colIndex === 1) return "text-[#4882F3]";
                        if (colIndex === 2) return roiColor;
                        return "";
                      };

                      return (
                        <td
                          key={colIndex}
                          className={`w-full h-20 min-w-24 capitalize px-2 whitespace-nowrap ${getClassNames()}`}
                        >
                          {colIndex === 3 ? (
                            <Speedometer value={parseFloat(row[column])} />
                          ) : (
                            row[column]
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-1 lg:max-w-[15%] max-w-[25%]">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto h-full">
              <table className="table-auto border-collapse w-full bg-transparent">
                <thead>
                  <tr>
                    <th className="w-full px-2 text-center py-3 text-xs font-medium tracking-wider">
                      Decision
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="h-20 capitalize px-2 text-center whitespace-nowrap">
                        <button
                          onClick={() => buttonAction(row)}
                          className={`text-xs font-semibold font[poppins] px-2 py-1 rounded-xl text-center border ${actionButtonColor}`}
                        >
                          {buttonLabel}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
