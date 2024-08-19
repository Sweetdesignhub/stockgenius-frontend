import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";


const PositionsTable = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const getPositionsData = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      if (!fyersAccessToken) {
        throw new Error(
          "No authorization token found. Please authenticate and try again."
        );
      }

      const headers = { Authorization: `Bearer ${fyersAccessToken}` };
      const response = await api.get(`/api/v1/fyers/positionsByUserId/${currentUser._id}`, {
        headers,
      });

      if (response.statusText === "OK") {
        setPositions(response.data.netPositions);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      setError(
        error.message ||
          "Failed to fetch positions. Please authenticate and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPositionsData();
    const interval = setInterval(getPositionsData, 5000);
    return () => clearInterval(interval);
  }, []);

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

  if (!positions || positions.length === 0) {
    // return <div className="text-center p-4">There are no positions</div>;
    return (
      <NotAvailable dynamicText={"Start by taking your <strong>first position!</strong>"} />
    );
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
                className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
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
