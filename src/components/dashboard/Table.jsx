// import React from "react";
// import Speedometer from "../common/Speedometer";

// function Table({
//   title,
//   data,
//   columns,
//   buttonLabel,
//   buttonAction,
//   buttonColor,
//   actionButtonColor,
//   roiColor,
// }) {
//   return (
//     <div className="flex-1 overflow-auto rounded-xl">
//       <div className="flex justify-between pb-2 border-b border-gray-500">
//         <button
//           className={`py-1 px-5 rounded-2xl bg-white font-bold ${buttonColor}`}
//         >
//           {buttonLabel}
//         </button>
//         <h2 className="font-semibold text-lg font-[poppins]">{title}</h2>
//       </div>

//       <div
//         className="overflow-scroll p-4 flex news-table rounded-xl mt-4"
//         style={{ maxHeight: "calc(70vh - 8rem)" }}
//       >
//         <div className="lg:max-w-[85%] max-w-[75%]">
//           <div className="overflow-x-auto">
//             <table className="table-auto w-full bg-transparent">
//               <thead>
//                 <tr>
//                   {columns.map((column, index) => (
//                     <th
//                       key={index}
//                       className="w-full px-2 text-left py-3 text-xs font-medium tracking-wider"
//                     >
//                       {column}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {columns.map((column, colIndex) => {
//                       const getClassNames = () => {
//                         if (colIndex === 1) return "text-[#4882F3]";
//                         if (colIndex === 2) return roiColor;
//                         return "";
//                       };

//                       return (
//                         <td
//                           key={colIndex}
//                           className={`w-full h-20 min-w-24 capitalize px-2 whitespace-nowrap ${getClassNames()}`}
//                         >
//                           {colIndex === 3 ? (
//                             <Speedometer value={parseFloat(row[column])} />
//                           ) : (
//                             row[column]
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="flex-1 lg:max-w-[15%] max-w-[25%]">
//           <div className="overflow-x-auto">
//             <div className="overflow-y-auto h-full">
//               <table className="table-auto border-collapse w-full bg-transparent">
//                 <thead>
//                   <tr>
//                     <th className="w-full px-2 text-center py-3 text-xs font-medium tracking-wider">
//                       Decision
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       <td className="h-20 capitalize px-2 text-center whitespace-nowrap">
//                         <button
//                           onClick={() => buttonAction(row)}
//                           className={`text-xs font-semibold font[poppins] px-2 py-1 rounded-xl text-center border ${actionButtonColor}`}
//                         >
//                           {buttonLabel}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Table;
import React from "react";
import Speedometer from "../common/Speedometer";

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
        className="overflow-scroll p-4 flex news-table rounded-xl mt-4"
        style={{ maxHeight: "calc(80vh)" }}
      >
        <div className="lg:max-w-[85%] max-w-[75%]">
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-transparent">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    index !== 3 && (
                      <th
                        key={index}
                        className="w-full px-2 text-left py-3 text-xs font-medium tracking-wider"
                      >
                        {column}
                      </th>
                    )
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
                        colIndex !== 3 && (
                          <td
                            key={colIndex}
                            className={`w-full h-20 min-w-24 capitalize px-2 whitespace-nowrap ${getClassNames()}`}
                          >
                            {row[column]}
                          </td>
                        )
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

