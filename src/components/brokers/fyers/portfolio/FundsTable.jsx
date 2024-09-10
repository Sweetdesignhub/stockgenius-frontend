import { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";

const FundsTable = ({ selectedColumns, setColumnNames }) => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const getFundsData = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      if (!fyersAccessToken) {
        throw new Error(
          "No authorization token found. Please authenticate and try again."
        );
      }

      const headers = { Authorization: `Bearer ${fyersAccessToken}` };
      const response = await api.get(
        `/api/v1/fyers/fundsByUserId/${currentUser.id}`,
        { headers }
      );
      // console.log(response.data.fund_limit);

      if (response.statusText === "OK") {
        setFunds(response.data.fund_limit);

        const excludedColumns = [];
        const allColumnNames = Object.keys(
          response.data.fund_limit[0] || {}
        ).filter((columnName) => !excludedColumns.includes(columnName));
        setColumnNames(allColumnNames);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching funds:", error);
      setError(
        error.message ||
        "Failed to fetch funds. Please authenticate and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFundsData();
    const interval = setInterval(getFundsData, 5000);
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

  if (!funds || funds.length === 0) {
    // return <div className="text-center p-4">There are no funds</div>;
    return (
      <NotAvailable
        dynamicText={"Opportunities are <strong>endless</strong>"}
      />
    );
  }

  // const excludedColumns = [];
  // let columnNames = Object.keys(funds[0]).filter(
  //   (columnName) => !excludedColumns.includes(columnName)
  // );

  // columnNames = ["title", ...columnNames.filter((col) => col !== "title")];

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="min-w-full border-collapse">
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
          {funds.map((fund, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${columnName === "title" ? "text-[#6FD4FF]" : ""
                    }`}
                >
                  {fund[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundsTable;
