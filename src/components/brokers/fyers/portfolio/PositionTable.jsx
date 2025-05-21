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
    <>
      <div className="h-[55vh] overflow-auto relative">
        <div className="flex">
          <div className="flex-grow overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-transparent sticky top-0 z-10">
                <tr>
                  {selectedColumns.map((columnName) => (
                    <th
                      key={columnName}
                      className="px-4 py-3 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left whitespace-nowrap"
                    >
                      {columnName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positionsData.map((position, index) => (
                  <tr key={position.id || index}>
                    {selectedColumns.map((columnName) => (
                      <td
                        key={`${columnName}-${position.id || index}`}                        
                        className={`px-4 py-4 whitespace-nowrap text-left font-semibold ${columnName === "symbol" ? "text-[#6FD4FF]" : ""
                          }`}
                      >
                        {columnName === "pl" || columnName === "unrealized_profit" 
                          ? Number(position[columnName]).toFixed(2)
                          : position[columnName] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-16 flex-shrink-0 sticky right-0 bg-transparent">
            <table className="w-full h-full border-collapse">
              <thead className="bg-transparent sticky top-0 z-10">
                <tr>
                  <th className="py-5"></th>
                </tr>
              </thead>
              <tbody>
                {positionsData.map((position, index) => (
                  <tr key={position.id || index} className="h-1">
                    <td className="px-4 py-4">
                      <div className="flex justify-center py-0">
                        <button
                          onClick={(e) => handleExitPosition(e, position)}
                          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-red-600 dark:text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <YesNoConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Exit Position"
        message={`Are you sure you want to exit the position with ID: <strong>${positionToExit?.id}?</strong>`}
        onConfirm={confirmExitPosition}
      />
    </>
  );
};

export default PositionsTable;
