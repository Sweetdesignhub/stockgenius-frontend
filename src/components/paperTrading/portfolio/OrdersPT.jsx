import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { formatDate } from "../../../utils/formatDate.js";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const OrdersPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  const { orders = [], loading } = usePaperTrading();
  const ordersData = orders || [];
  const { theme } = useTheme();

  useEffect(() => {
    if (ordersData.length > 0) {
      const excludedColumns = [
        "disclosedQuantity",
        "autoTrade",
        "createdAt",
        "updatedAt",
        "_id",
      ];
      const allColumnNames = Object.keys(ordersData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [ordersData, setColumnNames]);

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

  if (!ordersData || ordersData.length === 0) {
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
          {ordersData.map((order, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {["orderTime", "createdAt", "updatedAt"].includes(columnName)
                    ? formatDate(order[columnName])
                    : order[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPT;
