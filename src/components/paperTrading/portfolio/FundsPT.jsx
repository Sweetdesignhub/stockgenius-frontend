// import React, { useEffect, useMemo, useState } from "react";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import Loading from "../../common/Loading.jsx";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";
// import { useSelector } from "react-redux";
// import { getUserFunds } from "../../../paperTradingApi.js";

// const FundsPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);
//   // const [funds, setFunds] = useState({});
//   const [totalFunds, setTotalFunds] = useState(0);
//   const [showId, setShowId] = useState("");
//   const [investedAmount, setInvestedAmount] = useState(0);
//   // const [investedAmount, setInvestedAmount] = useState(0);
//   const [availableFunds, setAvailableFunds] = useState(0);
//   const [openingBalance, setOpeningBalance] = useState(0);
//   // const { funds = [], investedAmount, loading } = usePaperTrading();
//   // console.log("Funds Response:", funds);
//   // const outptu = getUserFunds();
//   const [usersId, setUsersId] = useState("");

//   const auth = useSelector((state) => state.user?.currentUser);

//   useEffect(() => {
//     if (auth?.id) {
//       setUsersId(auth.id);
//     }
//   }, [auth]);

//   useEffect(() => {
//     if (!usersId) return;

//     const fetchData = async () => {
//       try {
//         console.log("Fetching from the FUNDS PT");
//         const dataPaperTrading = await getUserFunds(usersId);
//         console.log(
//           "Paper Trading Data fetched from getUserFunds Inside fundsPT:",
//           dataPaperTrading.data.data.openingBalance
//         );
//         setTotalFunds(dataPaperTrading.data.data.totalFunds);
//         setShowId(dataPaperTrading.data.data.userId);
//         setInvestedAmount(dataPaperTrading.data.data.investedAmount);
//         setAvailableFunds(dataPaperTrading.data.data.availableFunds);
//         setOpeningBalance(dataPaperTrading.data.data.openingBalance);
//         console.log("Sow id :", showId);
//         // setAvailableFunds(dataPaperTrading.data.data.availableFunds);
//         // setHoldings(dataPaperTrading.holdings.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [usersId]);
//   const { theme } = useTheme();

//   const fundsData = useMemo(() => {
//     // Transform funds response into a consistent table structure
//     return [
//       {
//         id: 1,
//         title: "Total Balance",
//         equityAmount: (totalFunds || 0).toFixed(2),
//         commodityAmount: 0, // Assuming no commodityAmount in response
//         _id: showId,
//       },
//       // {
//       //   id: 2,
//       //   title: "Utilized Amount",
//       //   equityAmount: funds.usedMargin || 0,
//       //   commodityAmount: 0,
//       //   _id: "6777c6d0364dcb9e52cfec96",
//       // },
//       {
//         id: 2,
//         title: "Available Balance",
//         equityAmount: (availableFunds || 0).toFixed(2),
//         commodityAmount: 0,
//         _id: showId,
//       },
//       // {
//       //   id: 4,
//       //   title: "Realized Profit and Loss",
//       //   equityAmount: funds.realizedPnL || 0,
//       //   commodityAmount: 0,
//       //   _id: "6777c6d0364dcb9e52cfec98",
//       // },
//       // {
//       //   id: 5,
//       //   title: "Collaterals",
//       //   equityAmount: funds.availableMargin || 0,
//       //   commodityAmount: 0,
//       //   _id: "6777c6d0364dcb9e52cfec99",
//       // // },
//       {
//         id: 3,
//         title: "Opening Balance",
//         equityAmount: (openingBalance || 0).toFixed(2),
//         commodityAmount: 0,
//         _id: showId,
//       },
//       {
//         id: 4,
//         title: "Invested Amount",
//         equityAmount: (investedAmount || 0).toFixed(2),
//         commodityAmount: 0,
//         _id: "6777c6d0364dcb9e52cfec9a",
//       },
//       // {
//       //   id: 7,
//       //   title: "Receivables",
//       //   equityAmount: 0, // Assuming no explicit receivables in response
//       //   commodityAmount: 0,
//       //   _id: "6777c6d0364dcb9e52cfec9b",
//       // },
//     ];
//   }, [totalFunds, showId, investedAmount]);

//   useEffect(() => {
//     if (fundsData.length > 0) {
//       const allColumnNames = [
//         "id",
//         "title",
//         "equityAmount",
//         "commodityAmount",
//         "_id",
//       ];
//       setColumnNames(allColumnNames);
//     } else {
//       setColumnNames([]);
//     }
//   }, [fundsData, setColumnNames]);

//   // if (loading) {
//   //   return (
//   //     <div className="flex h-40 items-center justify-center p-4">
//   //       <Loading />
//   //     </div>
//   //   );
//   // }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   if (!fundsData || fundsData.length === 0) {
//     return (
//       <NotAvailable
//         dynamicText={"Opportunities are <strong>endless</strong>"}
//       />
//     );
//   }

//   return (
//     <div
//       className="h-[55vh] overflow-auto"
//       style={{
//         background: theme === "light" ? "#ffffff" : "#402788",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         borderRadius: "8px",
//       }}
//     >
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr>
//             {selectedColumns.map((columnName) => (
//               <th
//                 key={columnName}
//                 className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
//               >
//                 {columnName.replace(/([a-z])([A-Z])/g, "$1 $2")}{" "}
//                 {/* Convert camelCase to spaced */}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {fundsData.map((fund) => (
//             <tr key={fund._id}>
//               {selectedColumns.map((columnName) => (
//                 <td
//                   key={`${columnName}-${fund._id}`}
//                   className="px-4 whitespace-nowrap overflow-hidden font-semibold py-4"
//                 >
//                   {fund[columnName] ?? "-"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FundsPT;
import React, { useEffect, useMemo, useState } from "react";
import NotAvailable from "../../common/NotAvailable";
import Loading from "../../common/Loading";
import { useTheme } from "../../../contexts/ThemeContext";
import { useSelector } from "react-redux";
import { getUserFunds } from "../../../paperTradingApi";

const FundsPT = ({ selectedColumns, setColumnNames }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fundsData, setFundsData] = useState({
    totalFunds: 0,
    userId: "",
    investedAmount: 0,
    availableFunds: 0,
    openingBalance: 0,
  });

  const { theme } = useTheme();
  const userId = useSelector((state) => state.user?.currentUser?.id);

  // Fetch user funds data
  useEffect(() => {
    if (!userId) return;

    const fetchUserFunds = async () => {
      setIsLoading(true);
      try {
        const response = await getUserFunds(userId);
        const data = response.data.data;

        setFundsData({
          totalFunds: data.totalFunds,
          userId: data.userId,
          investedAmount: data.investedAmount,
          availableFunds: data.availableFunds,
          openingBalance: data.openingBalance,
        });
      } catch (error) {
        console.error("Error fetching funds data:", error);
        setError("Failed to load funds data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFunds();
  }, [userId]);

  // Transform funds data into table format
  const tableData = useMemo(() => {
    if (!fundsData.userId) return [];

    return [
      {
        id: 1,
        title: "Total Balance",
        equityAmount: (fundsData.totalFunds || 0).toFixed(2),
        commodityAmount: 0,
        _id: fundsData.userId,
      },
      {
        id: 2,
        title: "Available Balance",
        equityAmount: (fundsData.availableFunds || 0).toFixed(2),
        commodityAmount: 0,
        _id: fundsData.userId,
      },
      {
        id: 3,
        title: "Opening Balance",
        equityAmount: (fundsData.openingBalance || 0).toFixed(2),
        commodityAmount: 0,
        _id: fundsData.userId,
      },
      {
        id: 4,
        title: "Invested Amount",
        equityAmount: (fundsData.investedAmount || 0).toFixed(2),
        commodityAmount: 0,
        _id: fundsData.userId,
      },
    ];
  }, [fundsData]);

  // Update column names when table data is available
  useEffect(() => {
    if (tableData.length > 0) {
      setColumnNames(["id", "title", "equityAmount", "commodityAmount", "_id"]);
    } else {
      setColumnNames([]);
    }
  }, [tableData, setColumnNames]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!tableData || tableData.length === 0) {
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
                {columnName.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((fund) => (
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
