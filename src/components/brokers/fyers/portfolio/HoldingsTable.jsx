import { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";

const HoldingsTable = ({ setCount, selectedColumns, setColumnNames }) => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const getHoldingsData = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      if (!fyersAccessToken) {
        throw new Error(
          "No authorization token found. Please authenticate and try again."
        );
      }

      const headers = { Authorization: `Bearer ${fyersAccessToken}` };
      const response = await api.get(
        `/api/v1/fyers/holdingsByUserId/${currentUser?.id}`,
        { headers }
      );
      // console.log(response.data.holdings);

      if (response.data && Array.isArray(response.data.holdings)) {
        const holdingsData = response.data.holdings;
        setHoldings(holdingsData);
        setCount(holdingsData.length);

        if (holdingsData.length > 0) {
          const excludedColumns = ["message", "pan"];
          const allColumnNames = Object.keys(holdingsData[0]).filter(
            (columnName) => !excludedColumns.includes(columnName)
          );
          setColumnNames(allColumnNames);
        }
      } else {
        throw new Error("Invalid holdings data received");
      }
    } catch (error) {
      console.error("Error fetching holdings:", error);
      setError(
        error.message ||
          "Failed to fetch holdings. Please authenticate and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHoldingsData();
    const interval = setInterval(getHoldingsData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!holdings || holdings.length === 0) {
    // return <div className="text-center p-4">There are no holdings</div>;
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  const excludedColumns = ["holdingType"];
  let columnNames = Object.keys(holdings[0] || {}).filter(
    (columnName) => !excludedColumns.includes(columnName)
  );

  columnNames = ["symbol", ...columnNames.filter((col) => col !== "symbol")];

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {selectedColumns.map((columnName) => (
              <th
                key={columnName}
                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "symbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {holding[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
