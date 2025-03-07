// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
// import { useSelector } from "react-redux";
// import { fetchAllPaperTradingData } from "../../../paperTradingApi";
// import OrdersPT from "./OrdersPT";
// import PositionsPT from "./PositionsPT";
// import TradesPT from "./TradesPT";
// import HoldingsPT from "./HoldingsPT";
// import FundsPT from "./FundsPT";

// const StockDetailsPT = () => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [columnNames, setColumnNames] = useState([]);
//   const [selectedColumns, setSelectedColumns] = useState({});
//   const [currentTab, setCurrentTab] = useState(0);
//   const filterRef = useRef(null);
//   const [funds, setFunds] = useState({});
//   const [positions, setPositions] = useState([]);
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [orders, setOrders] = useState([]);
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
//         const dataPaperTrading = await fetchAllPaperTradingData(usersId);
//         console.log("Paper Trading Data:", dataPaperTrading);


//         setFunds(dataPaperTrading.funds || {});
//         setPositions(dataPaperTrading.positions);
//         setHoldings(dataPaperTrading.holdings.data);
//         setTrades(Array.isArray(dataPaperTrading.trades?.data) ? dataPaperTrading.trades?.data : []);
//         setOrders(Array.isArray(dataPaperTrading.orders?.orders) ? dataPaperTrading.orders?.orders : []);
//         // console.log("Orders are: ", dataPaperTrading);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [usersId]);

//   const categories = useMemo(
//     () => [
//       { name: `Orders (${orders?.length || 0})`, component: OrdersPT, key: "orders" },
//       { name: `All Positions (${positions?.length || 0})`, component: PositionsPT, key: "positions" },
//       { name: `Trades (${trades?.length || 0})`, component: TradesPT, key: "trades" },
//       { name: `Holdings (${holdings?.length || 0})`, component: HoldingsPT, key: "holdings" },
//       { name: "Funds", component: FundsPT, key: "funds" },
//     ],
//     [orders, positions, trades, holdings]
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setShowFilter(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleColumnToggle = useCallback((columnName) => {
//     const currentTabKey = categories[currentTab].key;
//     setSelectedColumns((prev) => ({
//       ...prev,
//       [currentTabKey]: {
//         ...prev[currentTabKey],
//         [columnName]: !prev[currentTabKey][columnName],
//       },
//     }));
//   }, [categories, currentTab]);

//   const setTabColumnNames = useCallback((names) => {
//     const currentTabKey = categories[currentTab].key;
//     setColumnNames(names);
//     setSelectedColumns((prev) => {
//       const existingSelections = prev[currentTabKey] || {};
//       const newSelections = names.reduce((acc, name) => {
//         acc[name] = name in existingSelections ? existingSelections[name] : true;
//         return acc;
//       }, {});
//       return { ...prev, [currentTabKey]: newSelections };
//     });
//   }, [categories, currentTab]);

//   const getSelectedColumns = useCallback(() => {
//     const currentTabKey = categories[currentTab].key;
//     const currentSelections = selectedColumns[currentTabKey] || {};
//     const selected = Object.keys(currentSelections).filter((col) => currentSelections[col]);
//     return selected.includes("symbol") ? ["symbol", ...selected.filter((col) => col !== "symbol")] : selected;
//   }, [categories, currentTab, selectedColumns]);

//   return (
//     <div className="flex w-full">
//       <div className="w-full">
//         <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
//           <div className="flex justify-between items-center flex-wrap">
//             <TabList className="flex gap-4 flex-wrap">
//               {categories.map(({ name, key }) => (
//                 <Tab
//                   key={key}
//                   className="rounded-full py-1 px-3 text-sm font-semibold focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10"
//                 >
//                   {name}
//                 </Tab>

//               ))}
//             </TabList>

//             <button onClick={() => setShowFilter(!showFilter)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
//               {/* Toggle Filter */}
//             </button>
//           </div>
//           {showFilter && (
//             <div ref={filterRef} className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow absolute right-0 z-10" style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}>
//               <h3 className="font-semibold mb-2">Select columns:</h3>
//               <div className="flex flex-col gap-2">
//                 {columnNames.map((columnName) => (
//                   <label key={columnName} className="flex items-center">
//                     <input type="checkbox" checked={selectedColumns[categories[currentTab].key]?.[columnName] ?? true} onChange={() => handleColumnToggle(columnName)} className="mr-2" />
//                     <span className="text-sm">{columnName}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="mt-3 overflow-hidden h-[55vh] rounded-lg">
//             <TabPanels className="h-full">
//               {categories.map(({ name, component: Component }) => (
//                 <TabPanel key={name} className="rounded-xl p-3 overflow-y-auto">
//                   <Component selectedColumns={getSelectedColumns()} setColumnNames={setTabColumnNames} data={{ positions: positions?.netPositions, trades, orders, holdings, funds }} />
//                 </TabPanel>
//               ))}
//             </TabPanels>
//           </div>
//         </TabGroup>
//       </div>
//     </div>
//   );
// };

// export default StockDetailsPT;


import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useSelector } from "react-redux";
import { fetchAllPaperTradingData } from "../../../paperTradingApi";
import OrdersPT from "./OrdersPT";
import PositionsPT from "./PositionsPT";
import TradesPT from "./TradesPT";
import HoldingsPT from "./HoldingsPT";
import FundsPT from "./FundsPT";

const StockDetailsPT = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const filterRef = useRef(null);
  const [funds, setFunds] = useState({});
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
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
        console.log("Paper Trading Data fetched from fetchAllPaperTradingData:", dataPaperTrading);

        setFunds(dataPaperTrading.funds || {});
        setPositions(dataPaperTrading.positions);
        setHoldings(dataPaperTrading.holdings.data);
        setTrades(Array.isArray(dataPaperTrading.trades?.data[0]?.trades) ? dataPaperTrading.trades.data[0].trades : []);
        setOrders(Array.isArray(dataPaperTrading.orders?.orders[0].orders) ? dataPaperTrading.orders?.orders[0].orders : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [usersId]);

  const categories = useMemo(
    () => [
      { name: `Orders (${orders?.length || 0})`, component: OrdersPT, key: "orders" },
      { name: `All Positions (${positions?.length || 0})`, component: PositionsPT, key: "positions" },
      { name: `Trades (${trades?.length || 0})`, component: TradesPT, key: "trades" },
      { name: `Holdings (${holdings?.length || 0})`, component: HoldingsPT, key: "holdings" },
      { name: "Funds", component: FundsPT, key: "funds" },
    ],
    [orders, positions, trades, holdings]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColumnToggle = useCallback((columnName) => {
    const currentTabKey = categories[currentTab].key;
    setSelectedColumns((prev) => ({
      ...prev,
      [currentTabKey]: {
        ...prev[currentTabKey],
        [columnName]: !prev[currentTabKey]?.[columnName],
      },
    }));
  }, [categories, currentTab]);

  const setTabColumnNames = useCallback(
    (names) => {
      const currentTabKey = categories[currentTab].key;
      setColumnNames(names);
      setSelectedColumns((prev) => {
        const existingSelections = prev[currentTabKey] || {};
        const newSelections = names.reduce((acc, name) => {
          acc[name] = name in existingSelections ? existingSelections[name] : true;
          return acc;
        }, {});
        return { ...prev, [currentTabKey]: newSelections };
      });
    },
    [categories, currentTab]
  );

  const getSelectedColumns = useCallback(() => {
    const currentTabKey = categories[currentTab].key;
    const currentSelections = selectedColumns[currentTabKey] || {};
    const selected = Object.keys(currentSelections).filter((col) => currentSelections[col]);
    return selected.includes("symbol") ? ["symbol", ...selected.filter((col) => col !== "symbol")] : selected;
  }, [categories, currentTab, selectedColumns]);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
          <div className="flex justify-between items-center flex-wrap">
            <TabList className="flex gap-4 flex-wrap">
              {categories.map(({ name, key }) => (
                <Tab
                  key={key}
                  className="rounded-full py-1 px-3 text-sm font-semibold focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10"
                >
                  {name}
                </Tab>
              ))}
            </TabList>

            <button onClick={() => setShowFilter(!showFilter)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
              {/* Toggle Filter */}
            </button>
          </div>

          {showFilter && (
            <div ref={filterRef} className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow absolute right-0 z-10" style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}>
              <h3 className="font-semibold mb-2">Select columns:</h3>
              <div className="flex flex-col gap-2">
                {columnNames.map((columnName) => (
                  <label key={columnName} className="flex items-center">
                    <input type="checkbox" checked={selectedColumns[categories[currentTab].key]?.[columnName] ?? true} onChange={() => handleColumnToggle(columnName)} className="mr-2" />
                    <span className="text-sm">{columnName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 overflow-hidden h-[55vh] rounded-lg">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component, key }) => (
                <TabPanel key={key} className="rounded-xl p-3 overflow-y-auto">
                  {/* console.log(""); */}
                  <Component selectedColumns={getSelectedColumns()} setColumnNames={setTabColumnNames} data={{ positions: positions, trades, orders, holdings, funds }} />
                </TabPanel>
              ))}
            </TabPanels>
          </div>
        </TabGroup>
      </div>
    </div>
  );
};

export default StockDetailsPT;
