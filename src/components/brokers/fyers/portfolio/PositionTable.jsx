import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

const PositionsTable = ({
  selectedColumns,
  setColumnNames,
  updatePositionCount,
}) => {
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
      // const response = await api.get(
      //   `/api/v1/fyers/positionsByUserId/${currentUser.id}`,
      //   {
      //     headers,
      //   }
      // );

      const response = {
        overall: {
          count_total: 4,
          count_open: 0,
          pl_total: 93.24999999999972,
          pl_realized: 93.24999999999972,
          pl_unrealized: 0,
        },
        netPositions: [
          {
            netQty: 0,
            qty: 0,
            netAvg: 0,
            side: 0,
            productType: "INTRADAY",
            realized_profit: 1.3500000000011596,
            unrealized_profit: 0,
            pl: 1.3500000000011596,
            ltp: 334,
            buyQty: 129,
            buyAvg: 334.0147286821705,
            buyVal: 43087.9,
            sellQty: 129,
            sellAvg: 334.0251937984496,
            sellVal: 43089.25,
            slNo: 0,
            fyToken: "101000000014977",
            crossCurrency: "",
            rbiRefRate: 1,
            qtyMulti_com: 1,
            segment: 10,
            symbol: "NSE:POWERGRID-EQ",
            id: "NSE:POWERGRID-EQ-INTRADAY",
            cfBuyQty: 0,
            cfSellQty: 0,
            dayBuyQty: 129,
            daySellQty: 129,
            exchange: 10,
            _id: "66c7a0f2cf14d38643416c3e",
          },
          {
            netQty: 0,
            qty: 0,
            netAvg: 0,
            side: 0,
            productType: "INTRADAY",
            realized_profit: -33.69999999999908,
            unrealized_profit: 0,
            pl: -33.69999999999908,
            ltp: 324.35,
            buyQty: 109,
            buyAvg: 326.6788990825688,
            buyVal: 35608,
            sellQty: 109,
            sellAvg: 326.3697247706422,
            sellVal: 35574.3,
            slNo: 0,
            fyToken: "10100000002475",
            crossCurrency: "",
            rbiRefRate: 1,
            qtyMulti_com: 1,
            segment: 10,
            symbol: "NSE:ONGC-EQ",
            id: "NSE:ONGC-EQ-INTRADAY",
            cfBuyQty: 0,
            cfSellQty: 0,
            dayBuyQty: 109,
            daySellQty: 109,
            exchange: 10,
            _id: "66c7a0f2cf14d38643416c3f",
          },
          {
            netQty: 0,
            qty: 0,
            netAvg: 0,
            side: 0,
            productType: "INTRADAY",
            realized_profit: 116.09999999999877,
            unrealized_profit: 0,
            pl: 116.09999999999877,
            ltp: 1440.3,
            buyQty: 27,
            buyAvg: 1410.9722222222222,
            buyVal: 38096.25,
            sellQty: 27,
            sellAvg: 1415.2722222222221,
            sellVal: 38212.35,
            slNo: 0,
            fyToken: "101000000010099",
            crossCurrency: "",
            rbiRefRate: 1,
            qtyMulti_com: 1,
            segment: 10,
            symbol: "NSE:GODREJCP-EQ",
            id: "NSE:GODREJCP-EQ-INTRADAY",
            cfBuyQty: 0,
            cfSellQty: 0,
            dayBuyQty: 27,
            daySellQty: 27,
            exchange: 10,
            _id: "66c7a0f2cf14d38643416c40",
          },
          {
            netQty: 0,
            qty: 0,
            netAvg: 0,
            side: 0,
            productType: "INTRADAY",
            realized_profit: 9.499999999998863,
            unrealized_profit: 0,
            pl: 9.499999999998863,
            ltp: 1205.8,
            buyQty: 9,
            buyAvg: 1202.8277777777778,
            buyVal: 10825.45,
            sellQty: 9,
            sellAvg: 1203.8833333333332,
            sellVal: 10834.95,
            slNo: 0,
            fyToken: "10100000003432",
            crossCurrency: "",
            rbiRefRate: 1,
            qtyMulti_com: 1,
            segment: 10,
            symbol: "NSE:TATACONSUM-EQ",
            id: "NSE:TATACONSUM-EQ-INTRADAY",
            cfBuyQty: 0,
            cfSellQty: 0,
            dayBuyQty: 9,
            daySellQty: 9,
            exchange: 10,
            _id: "66c7a0f2cf14d38643416c41",
          },
        ],
        _id: "66c7a0f2cf14d38643416c3d",
        createdAt: "2024-08-22T20:34:58.747Z",
        updatedAt: "2024-08-22T20:34:58.747Z",
      };

      // if (response.statusText === "OK") {
      //   const positionsData = response.data.netPositions;
      //   setPositions(positionsData);
      //   setCount(positionsData.length);

      //   const excludedColumns = ["message", "pan"];
      //   const allColumnNames = Object.keys(positionsData[0]).filter(
      //     (columnName) => !excludedColumns.includes(columnName)
      //   );
      //   setColumnNames(allColumnNames);
      // } else {
      //   throw new Error(response.data.message);
      // }
      const positionsData = response.netPositions;
      setPositions(positionsData);
      updatePositionCount(positionsData.length);

      const excludedColumns = ["message", "pan"];
      const allColumnNames = Object.keys(positionsData[0]).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );
      setColumnNames(allColumnNames);
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

  const handleExitPosition = (id) => {
    console.log(id);
    setPositions((prevPositions) => {
      const updatedPositions = prevPositions.filter(
        (position) => position.id !== id
      );
      updatePositionCount(updatedPositions.length);
      return updatedPositions;
    });
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

  if (!positions || positions.length === 0) {
    // return <div className="text-center p-4">There are no positions</div>;
    return (
      <NotAvailable
        dynamicText={"Start by taking your <strong>first position!</strong>"}
      />
    );
  }

  // const excludedColumns = [];
  // const columnNames = Object.keys(positions[0]).filter(
  //   (columnName) => !excludedColumns.includes(columnName)
  // );

  return (
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
              {positions.map((position, index) => (
                <tr key={index}>
                  {selectedColumns.map((columnName) => (
                    <td
                      key={`${columnName}-${index}`}
                      className="px-4 py-4 whitespace-nowrap text-left font-semibold"
                    >
                      {position[columnName]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-16 flex-shrink-0 sticky right-0 bg-white dark:bg-transparent">
          <table className="w-full h-full border-collapse ">
            <thead className="bg-transparent sticky top-0 z-10 ">
              <tr>
                <th className="py-5 "></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={index}>
                  <td className="p-0">
                    <div className="flex justify-center items-center h-[41px] ">
                      <button
                        onClick={() => handleExitPosition(position.id)}
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
  );
};

export default PositionsTable;
