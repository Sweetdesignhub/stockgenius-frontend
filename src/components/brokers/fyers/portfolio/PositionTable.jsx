// import React, { useEffect, useState } from "react";
// import { fetchPositions } from "../api";
// import Loading from "../../../common/Loading";

// const PositionsTable = () => {
//   const [positions, setPositions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getPositionsData = async () => {
//       try {
//         const response = await fetchPositions();
//         if (response.s === "ok") {
//           setPositions(response.netPositions);
//           setLoading(false); // Set loading to false once data is fetched
//         } else {
//           setError(response.message); // Set error message if API request fails
//           setLoading(false); // Set loading to false in case of error
//         }
//       } catch (error) {
//         console.error("Error fetching positions:", error);
//         setError("Failed to fetch positions. Please authenticate and try again....."); // Set error message for network or other errors
//         setLoading(false); // Set loading to false in case of error
//       }
//     };

//     getPositionsData();
//   }, []);

//   if (loading) {
//     return <div className="text-center p-4"><Loading/></div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   if (!positions || positions.length === 0) {
//     return <div className="text-center p-4">There are no positions</div>;
//   }

//   // Columns to exclude
//   const excludedColumns = [];

//   const columnNames = Object.keys(positions[0]).filter(
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
//           {positions.map((position, index) => (
//             <tr key={index} className="text-center">
//               {columnNames.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className="px-4 whitespace-nowrap text-left font-semibold py-4"
//                 >
//                   {position[columnName]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PositionsTable;


import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";

const PositionsTable = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPositionsData = async () => {
      try {
        const response = await api.get("/api/v1/fyers/fetchPositions");
        if (response.data.s === "ok") {
          setPositions(response.data.netPositions);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setError("Failed to fetch positions. Please authenticate and try again.");
      } finally {
        setLoading(false);
      }
    };

    getPositionsData();
  }, []);

  if (loading) {
    return <div className="text-center p-4"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!positions || positions.length === 0) {
    return <div className="text-center p-4">There are no positions</div>;
  }

  const excludedColumns = [];

  const columnNames = Object.keys(positions[0]).filter(
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
          {positions.map((position, index) => (
            <tr key={index} className="text-center">
              {columnNames.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className="px-4 whitespace-nowrap text-left font-semibold py-4"
                >
                  {position[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;

