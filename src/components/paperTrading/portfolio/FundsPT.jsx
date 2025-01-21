import React, { useEffect, useMemo, useState } from "react";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import NotAvailable from "../../common/NotAvailable.jsx";
import Loading from "../../common/Loading.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const FundsPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  const { funds = [], investedAmount, loading } = usePaperTrading();
  console.log("Funds Response:", funds);

  const { theme } = useTheme();

  const fundsData = useMemo(() => {
    // Transform funds response into a consistent table structure
    return [
      {
        id: 1,
        title: "Total Balance",
        equityAmount: (funds.totalFunds || 0).toFixed(2),
        commodityAmount: 0, // Assuming no commodityAmount in response
        _id: "6777c6d0364dcb9e52cfec95",
      },
      // {
      //   id: 2,
      //   title: "Utilized Amount",
      //   equityAmount: funds.usedMargin || 0,
      //   commodityAmount: 0,
      //   _id: "6777c6d0364dcb9e52cfec96",
      // },
      {
        id: 2,
        title: "Available Balance",
        equityAmount: (funds.availableFunds || 0).toFixed(2),
        commodityAmount: 0,
        _id: "6777c6d0364dcb9e52cfec97",
      },
      // {
      //   id: 4,
      //   title: "Realized Profit and Loss",
      //   equityAmount: funds.realizedPnL || 0,
      //   commodityAmount: 0,
      //   _id: "6777c6d0364dcb9e52cfec98",
      // },
      // {
      //   id: 5,
      //   title: "Collaterals",
      //   equityAmount: funds.availableMargin || 0,
      //   commodityAmount: 0,
      //   _id: "6777c6d0364dcb9e52cfec99",
      // },
      {
        id: 3,
        title: "Opening Balance",
        equityAmount: (funds.openingBalance || 0).toFixed(2),
        commodityAmount: 0,
        _id: "6777c6d0364dcb9e52cfec99",
      },
      {
        id: 4,
        title: "Invested Amount",
        equityAmount: (investedAmount || 0).toFixed(2),
        commodityAmount: 0,
        _id: "6777c6d0364dcb9e52cfec9a",
      },
      // {
      //   id: 7,
      //   title: "Receivables",
      //   equityAmount: 0, // Assuming no explicit receivables in response
      //   commodityAmount: 0,
      //   _id: "6777c6d0364dcb9e52cfec9b",
      // },
    ];
  }, [funds]);

  useEffect(() => {
    if (fundsData.length > 0) {
      const allColumnNames = [
        "id",
        "title",
        "equityAmount",
        "commodityAmount",
        "_id",
      ];
      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [fundsData, setColumnNames]);

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

  if (!fundsData || fundsData.length === 0) {
    return (
      <NotAvailable
        dynamicText={"Opportunities are <strong>endless</strong>"}
      />
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
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {selectedColumns.map((columnName) => (
              <th
                key={columnName}
                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
              >
                {columnName.replace(/([a-z])([A-Z])/g, "$1 $2")}{" "}
                {/* Convert camelCase to spaced */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fundsData.map((fund) => (
            <tr key={fund._id}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${fund._id}`}
                  className="px-4 whitespace-nowrap overflow-hidden font-semibold py-4"
                >
                  {fund[columnName] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundsPT;
