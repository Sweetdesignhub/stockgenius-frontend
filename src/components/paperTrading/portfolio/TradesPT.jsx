import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { formatDate } from "../../../utils/formatDate";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { fetchAllPaperTradingData } from "../../../paperTradingApi";
const TradesPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);
  const [trades, setTrades] = useState([]);
  const tradesData = trades || [];
  // const { trades = [], loading } = usePaperTrading();
  const { theme } = useTheme();
  const [usersId, setUsersId] = useState("");

  const auth = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    if (auth?.id) {
      setUsersId(auth.id);
    }
  }, [auth]);

  useEffect(() => {
    if (!usersId) return;

    const fetchData = async () => {
      try {
        console.log("cdsuhvbcuadbvjhcbadjb");
        const dataPaperTrading = await fetchAllPaperTradingData(usersId);
        console.log("Paper Trading Data fetched from fetchAllPaperTradingData:", dataPaperTrading);

        setTrades(Array.isArray(dataPaperTrading.trades?.data[0]?.trades) ? dataPaperTrading.trades.data[0].trades : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [usersId]);

  useEffect(() => {
    if (tradesData.length > 0) {
      const excludedColumns = ["fees", "tags", "createdAt", "updatedAt", "_id"];
      const allColumnNames = Object.keys(tradesData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [tradesData, setColumnNames]);

  // if (loading) {
  //   return (
  //     <div className="flex h-40 items-center justify-center p-4">
  //       <Loading />
  //     </div>
  //   );
  // }


  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!tradesData || tradesData.length === 0) {
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  return (
    <div
      className="h-[55vh] overflow-auto"
      style={{
        background: theme === "light" ? "#ffffff" : "#402788",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
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
          {tradesData.map((trade, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                    }`}
                >
                  {["tradeDateTime", "createdAt", "updatedAt"].includes(columnName)
                    ? formatDate(trade[columnName])
                    : columnName === "tradeValue"
                      ? parseFloat(trade[columnName]).toFixed(2)
                      : trade[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesPT;
