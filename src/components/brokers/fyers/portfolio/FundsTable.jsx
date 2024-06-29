import React, { useEffect, useState } from "react";
import { fetchFunds } from "../api";
import Loading from "../../../common/Loading";

const FundsTable = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFundsData = async () => {
      try {
        const response = await fetchFunds();
        if (response.s === "ok") {
          setFunds(response.fund_limit);
          setLoading(false); 
        } else {
          setError(response.message); 
          setLoading(false); 
        }
      } catch (error) {
        console.error("Error fetching funds:", error);
        setError("Failed to fetch funds. Please authenticate and try again....");
        setLoading(false); 
      }
    };

    getFundsData();
  }, []);

  if (loading) {
    return <div className="text-center p-4"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!funds || funds.length === 0) {
    return <div className="text-center p-4">There are no funds</div>;
  }

  // Columns to exclude
  const excludedColumns = [];

  let columnNames = Object.keys(funds[0]).filter(
    (columnName) => !excludedColumns.includes(columnName)
  );

  // Ensure 'title' is the first column
  columnNames = ["title", ...columnNames.filter((col) => col !== "title")];

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th
                key={columnName}
                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, index) => (
            <tr key={index}>
              {columnNames.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "title" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {fund[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundsTable;
