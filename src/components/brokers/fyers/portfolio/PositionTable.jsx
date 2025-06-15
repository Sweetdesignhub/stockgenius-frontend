import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import YesNoConfirmationModal from "../../../common/YesNoConfirmationModal.jsx";
import { useData } from "../../../../contexts/FyersDataContext.jsx";

const PositionsTable = ({
  selectedColumns,
  setColumnNames,
}) => {
  // const [positions, setPositions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positionToExit, setPositionToExit] = useState(null);
  const { positions = { netPositions: [] }, loading } = useData();
  const positionsData = positions.netPositions || [];

  // const getPositionsData = async () => {
  //   try {
  //     const fyersAccessToken = localStorage.getItem("fyers_access_token");
  //     if (!fyersAccessToken) {
  //       throw new Error(
  //         "No authorization token found. Please authenticate and try again."
  //       );
  //     }

  //     const headers = { Authorization: `Bearer ${fyersAccessToken}` };
  //     const response = await api.get(
  //       `/api/v1/fyers/positionsByUserId/${currentUser.id}`,
  //       {
  //         headers,
  //       }
  //     );

  //     let positionsData;
  //     if (response.data && response.data.netPositions) {
  //       // If using real API response
  //       positionsData = response.data.netPositions;
  //     } else {
  //       throw new Error("Unexpected response format");
  //     }

  //     setPositions(positionsData);
  //     setCount(positionsData.length);

  //     const excludedColumns = ["message", "pan"];
  //     const allColumnNames = Object.keys(positionsData[0] || {}).filter(
  //       (columnName) => !excludedColumns.includes(columnName)
  //     );
  //     setColumnNames(allColumnNames);
  //   } catch (error) {
  //     console.error("Error fetching positions:", error);
  //     setError(
  //       error.message ||
  //       "Failed to fetch positions. Please authenticate and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getPositionsData();
  //   const interval = setInterval(getPositionsData, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (positionsData.length > 0) {
      const excludedColumns = [];
      const allColumnNames = Object.keys(positionsData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );
      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [positionsData, setColumnNames]);

  const handleExitPosition = (event, position) => {
    event.stopPropagation();
    setPositionToExit(position);
    setIsModalOpen(true);
  };

  const confirmExitPosition = async () => {
    if (positionToExit) {
      try {
        const fyersAccessToken = localStorage.getItem("fyers_access_token");
        if (!fyersAccessToken) {
          throw new Error(
            "No authorization token found. Please authenticate and try again."
          );
        }

        const response = await api.post(
          `/api/v1/fyers/exit-position/${currentUser.id}`,
          {
            accessToken: fyersAccessToken,
            positionId: positionToExit.id,
          }
        );

        if (response.status === 200) {
          // setPositions((prevPositions) => {
          //   const updatedPositions = prevPositions.filter(
          //     (position) => position.id !== positionToExit.id
          //   );
          //   setCount(updatedPositions.length);
          //   return updatedPositions;
          // });
          alert("Position exited successfully");
        } else {
          throw new Error("Failed to exit position");
        }
      } catch (error) {
        console.error("Error exiting position:", error);
        alert(`Failed to exit position: ${error.message}`);
      } finally {
        setIsModalOpen(false);
        setPositionToExit(null);
      }
    }
  };

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

  if (!positionsData || positionsData.length === 0) {
    // return <div className="text-center p-4">There are no positions</div>;
    return (
      <NotAvailable
        dynamicText={"Start by taking your <strong>first position!</strong>"}
      />
    );
  }

  return (
    <div className="h-[44vh] overflow-auto scrollbar-hide">
      <table className="w-full border-collapse">
        <thead className="bg-transparent sticky top-0 z-10">
          <tr>
            {selectedColumns.map((columnName) => (
              <th
                key={columnName}
                className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm font-[poppins] font-normal dark:text-[#FFFFFF99] text-left whitespace-nowrap"
              >
                {columnName}
              </th>
            ))}
            <th className="w-8 sm:w-12 lg:w-16"></th> {/* Action column */}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {positionsData.map((position, index) => (
            <tr key={position.id || index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${position.id || index}`}
                  className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold ${
                    columnName === "symbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {columnName === "pl" || columnName === "unrealized_profit" || columnName === "realized_profit" || columnName === "buyAvg" || columnName === "sellAvg"
                    ? Number(position[columnName]).toFixed(2)
                    : position[columnName] || ""}
                </td>
              ))}
              <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 whitespace-nowrap">
                <button
                  onClick={(e) => handleExitPosition(e, position)}
                  className="p-0.5 sm:p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-white" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <YesNoConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Exit Position"
        message={`Are you sure you want to exit the position with ID: <strong>${positionToExit?.id}?</strong>`}
        onConfirm={confirmExitPosition}
      />
    </div>
  );
};

export default PositionsTable;
