// import React, { useEffect, useState } from "react";
// import { getOrders } from "../api";
// import Loading from "../../../common/Loading";

// const OrdersTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const response = await getOrders();
//         if (response.s === "ok") {
//           setOrders(response.orderBook);
//           setLoading(false);
//         } else {
//           setError(response.message); 
//           setLoading(false); 
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setError("Failed to fetch orders. Please authenticate and try again....."); 
//         setLoading(false); 
//       }
//     };

//     fetchOrdersData();
//   }, []);

//   if (loading) {
//     return <div className="text-center p-4"><Loading/></div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   if (!orders || orders.length === 0) {
//     return <div className="text-center p-4">There are no orders</div>;
//   }

//   const excludedColumns = ["message", "pan"];

//   const columnNames = Object.keys(orders[0]).filter(
//     (columnName) => !excludedColumns.includes(columnName)
//   );

//   return (
//     <div className="h-[55vh] overflow-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr>
//             {columnNames.map((columnName) => (
//               <th
//                 key={columnName}
//                 className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal text-[#FFFFFF99] text-left"
//               >
//                 {columnName}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order, index) => (
//             <tr key={index} className="text-center">
//               {columnNames.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className="px-4 whitespace-nowrap text-left font-semibold py-4"
//                 >
//                   {order[columnName]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersTable;

import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const response = await api.get("/api/v1/fyers/getOrders");
        if (response.data.s === "ok") {
          setOrders(response.data.orderBook);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please authenticate and try again.");
      } finally {
        setLoading(false);
      }
    };

    getOrdersData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="text-center p-4">There are no orders</div>;
  }

  const excludedColumns = ["message", "pan"];

  const columnNames = Object.keys(orders[0]).filter(
    (columnName) => !excludedColumns.includes(columnName)
  );

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th
                key={columnName}
                className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="text-center">
              {columnNames.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className="px-4 whitespace-nowrap text-left font-semibold py-4"
                >
                  {order[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
