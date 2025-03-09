import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { formatDate } from "../../../utils/formatDate.js";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { fetchAllPaperTradingData } from "../../../paperTradingApi";

const OrdersPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  console.log("Inside OrderPT");
  console.log({ selectedColumns, setColumnNames });
  const [usersId, setUsersId] = useState("");

  const auth = useSelector((state) => state.user?.currentUser);

  console.log("Orders are: ", orders);
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
        console.log("Paper Trading Data fetched from fetchAllPaperTradingData Inside ordersPT:", dataPaperTrading.orders?.orders[0].orders);

        setOrders(Array.isArray(dataPaperTrading.orders?.orders[0].orders) ? dataPaperTrading.orders?.orders[0].orders : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [usersId]);
  // const { orders = [], loading } = usePaperTrading();
  const { theme } = useTheme();

  useEffect(() => {
    if (orders.length > 0) {
      const excludedColumns = ["disclosedQuantity",'autoTrade',"filledQuantity", "createdAt", "updatedAt", "_id"];
      let allColumnNames = Object.keys(orders[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      // Ensure "autoTrade" is the 2nd column
      allColumnNames = ["stockSymbol", ...allColumnNames.filter(col => col !== "autoTrade")];

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [orders, setColumnNames]);

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

  if (!orders || orders.length === 0) {
    return <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />;
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
                {columnName === "orderTime" ? "Order Time (IST)" : columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                    }`}
                >
                  {columnName === "orderTime"
                    ? formatDate(order[columnName]) // Date & time in IST
                    : columnName === "autoTrade"
                      ? order[columnName] ? "Yes" : "No" // Display Yes/No for autoTrade
                      : order[columnName] || "-"}
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
