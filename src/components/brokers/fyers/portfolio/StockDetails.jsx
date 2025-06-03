import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import HoldingsTable from "./HoldingsTable";
import FundsTable from "./FundsTable";
import OrdersTable from "./OrdersTable";
import TradesTable from "./TradesTable";
import PositionsTable from "./PositionTable";
import { RiMenuLine, RiRefreshLine } from "react-icons/ri";
import { useData } from "../../../../contexts/FyersDataContext";

const StockDetails = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const filterRef = useRef(null);

  // ✅ Get all data from optimized context
  const {
    holdings = [],
    positions = {},
    orders = [],
    trades = [],
    funds = {},
    loading,
    refreshData
  } = useData();
  console.log("Data reiced!", {
    holdings,
    positions,
    orders,

  });
  // ✅ Normalize data structures for consistent access
  const normalizedData = useMemo(() => {
    // Handle holdings - could be array or object with holdings property
    const holdingsArray = Array.isArray(holdings)
      ? holdings
      : (holdings?.holdings || []);

    // Handle positions - could be array or object with netPositions property
    const positionsArray = Array.isArray(positions)
      ? positions
      : (positions?.netPositions || []);

    // Handle orders - could be array or object with orderBook property
    const ordersArray = Array.isArray(orders)
      ? orders
      : (orders?.orderBook || []);
    console.log("Order Array:", ordersArray);

    // Handle trades - ensure it's always an array
    const tradesArray = Array.isArray(trades) ? trades : [];

    return {
      holdings: holdingsArray,
      positions: positionsArray,
      orders: ordersArray,
      trades: tradesArray,
      funds: funds || {}
    };
  }, [holdings, positions, orders, trades, funds]);

  // ✅ Categories with real-time counts
  const categories = useMemo(() => [
    {
      name: `Orders (${normalizedData.orders.length})`,
      component: OrdersTable,
      key: "orders",
    },
    {
      name: `All Positions (${normalizedData.positions.length})`,
      component: PositionsTable,
      key: "positions",
    },
    {
      name: `Trades (${normalizedData.trades.length})`,
      component: TradesTable,
      key: "trades",
    },
    {
      name: `Holdings (${normalizedData.holdings.length})`,
      component: HoldingsTable,
      key: "holdings",
    },
    {
      name: "Funds",
      component: FundsTable,
      key: "funds"
    },
  ], [
    normalizedData.orders.length,
    normalizedData.positions.length,
    normalizedData.trades.length,
    normalizedData.holdings.length
  ]);

  console.log("TRADES ARE:", normalizedData.trades);

  // ✅ Handle clicks outside filter dropdown
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

  // ✅ Toggle filter dropdown
  const toggleFilter = useCallback(() => {
    setShowFilter(prev => !prev);
  }, []);

  // ✅ Handle manual refresh
  const handleRefresh = useCallback(async () => {
    if (refreshData) {
      try {
        await refreshData();
        console.log("✅ Data refreshed successfully");
      } catch (error) {
        console.error("❌ Error refreshing data:", error);
      }
    }
  }, [refreshData]);

  // ✅ Handle column toggle with proper error handling
  const handleColumnToggle = useCallback((columnName) => {
    const currentTabKey = categories[currentTab]?.key;
    if (!currentTabKey) return;

    setSelectedColumns((prev) => ({
      ...prev,
      [currentTabKey]: {
        ...(prev[currentTabKey] || {}),
        [columnName]: !(prev[currentTabKey]?.[columnName] ?? true),
      },
    }));
  }, [categories, currentTab]);

  // ✅ Set column names for current tab
  const setTabColumnNames = useCallback((names) => {
    const currentTabKey = categories[currentTab]?.key;
    if (!currentTabKey || !Array.isArray(names)) return;

    setColumnNames(names);

    setSelectedColumns((prev) => {
      const existingSelections = prev[currentTabKey] || {};
      const newSelections = names.reduce((acc, name) => {
        acc[name] = name in existingSelections ? existingSelections[name] : true;
        return acc;
      }, {});
      return { ...prev, [currentTabKey]: newSelections };
    });
  }, [currentTab, categories]);

  // ✅ Get selected columns for current tab
  const getSelectedColumns = useCallback(() => {
    const currentTabKey = categories[currentTab]?.key;
    if (!currentTabKey) return [];

    const currentSelections = selectedColumns[currentTabKey] || {};
    const selected = Object.keys(currentSelections).filter(
      (col) => currentSelections[col]
    );

    // Always put 'symbol' first if it exists
    if (selected.includes('symbol')) {
      return ['symbol', ...selected.filter(col => col !== 'symbol')];
    }

    return selected;
  }, [categories, currentTab, selectedColumns]);

  // ✅ Check for Fyers access token
  const fyersAccessToken = localStorage.getItem("fyers_access_token");

  // ✅ Show connection prompt if no token
  if (!fyersAccessToken) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please connect your Fyers broker account</p>
          <p className="text-sm text-gray-500">
            You need to authenticate with Fyers to view your trading data
          </p>
        </div>
      </div>
    );
  }

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[60vh] w-full">
      <div className="w-full">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
          <div className="flex justify-between items-center">
            <TabList className="flex gap-4 flex-wrap">
              {categories.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10 data-[hover]:bg-gray-300 dark:data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-gray-300 dark:data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {name}
                </Tab>
              ))}
            </TabList>

            <div className="flex items-center gap-2">
              {/* ✅ Filter Button */}
              <button
                onClick={toggleFilter}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Filter Columns"
              >
                <RiMenuLine className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ✅ Filter Dropdown */}
          {showFilter && (
            <div
              ref={filterRef}
              className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg absolute right-0 z-20 border dark:border-gray-700"
              style={{ maxHeight: "300px", overflowY: "auto", width: "250px" }}
            >
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Select columns:
              </h3>

              <div className="flex flex-col gap-2">
                {columnNames.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No columns available
                  </p>
                ) : (
                  columnNames.map((columnName) => (
                    <label key={columnName} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={
                          selectedColumns[categories[currentTab]?.key]?.[columnName] ?? true
                        }
                        onChange={() => handleColumnToggle(columnName)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {columnName}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ✅ Tab Panels */}
          <div className="mt-3 overflow-hidden h-[55vh] rounded-lg border dark:border-gray-700">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component, key }) => (
                <TabPanel
                  key={name}
                  className="rounded-xl p-3 overflow-y-auto h-full"
                >
                  <Component
                    selectedColumns={getSelectedColumns()}
                    setColumnNames={setTabColumnNames}
                    data={normalizedData[key]} // Pass specific data for each component
                    allData={normalizedData} // Pass all data if needed
                    loading={loading}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </div>
        </TabGroup>


      </div>
    </div>
  );
};



export default StockDetails;














/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////



// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
// import HoldingsTable from "./HoldingsTable";
// import FundsTable from "./FundsTable";
// import OrdersTable from "./OrdersTable";
// import TradesTable from "./TradesTable";
// import PositionsTable from "./PositionTable";
// import { RiMenuLine } from "react-icons/ri";
// // import api from "../../../../config.js";
// // import { useSelector } from "react-redux";
// import { useData } from "../../../../contexts/FyersDataContext";

// const StockDetails = () => {
//   // const [ordersCount, setOrdersCount] = useState(0);
//   // const [positionsCount, setPositionsCount] = useState(0);
//   // const [holdingsCount, setHoldingsCount] = useState(0);
//   const [showFilter, setShowFilter] = useState(false);
//   const [columnNames, setColumnNames] = useState([]);
//   const [selectedColumns, setSelectedColumns] = useState({});
//   const [currentTab, setCurrentTab] = useState(0);
//   const filterRef = useRef(null);
//   //  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
//   //  const { currentUser } = useSelector((state) => state.user);

// const {
//   holdings = [],
//   positions = {},
//   orders = [],
//   trades = [],
//   funds = {},
//   loading,
//   refreshData
// } = useData();

//   // ✅ Normalize data structures for consistent access
//   const normalizedData = useMemo(() => {
//     // Handle holdings - could be array or object with holdings property
//     const holdingsArray = Array.isArray(holdings)
//       ? holdings
//       : (holdings?.holdings || []);

//     // Handle positions - could be array or object with netPositions property
//     const positionsArray = Array.isArray(positions)
//       ? positions
//       : (positions?.netPositions || []);

//     // Handle orders - could be array or object with orderBook property
//     const ordersArray = Array.isArray(orders)
//       ? orders
//       : (orders?.orderBook || []);
//     console.log("Order Array:", ordersArray);

//     // Handle trades - ensure it's always an array
//     const tradesArray = Array.isArray(trades) ? trades : [];

//     return {
//       holdings: holdingsArray,
//       positions: positionsArray,
//       orders: ordersArray,
//       trades: tradesArray,
//       funds: funds || {}
//     };
//   }, [holdings, positions, orders, trades, funds]);

//   // ✅ Categories with real-time counts
//   const categories = useMemo(() => [
//     {
//       name: `Orders (${normalizedData.orders.length})`,
//       component: OrdersTable,
//       key: "orders",
//     },
//     {
//       name: `All Positions (${normalizedData.positions.length})`,
//       component: PositionsTable,
//       key: "positions",
//     },
//     {
//       name: `Trades (${normalizedData.trades.length})`,
//       component: TradesTable,
//       key: "trades",
//     },
//     {
//       name: `Holdings (${normalizedData.holdings.length})`,
//       component: HoldingsTable,
//       key: "holdings",
//     },
//     {
//       name: "Funds",
//       component: FundsTable,
//       key: "funds"
//     },
//   ], [
//     normalizedData.orders.length,
//     normalizedData.positions.length,
//     normalizedData.trades.length,
//     normalizedData.holdings.length
//   ]);



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

//   // ✅ Toggle filter dropdown
//   const toggleFilter = useCallback(() => {
//     setShowFilter(prev => !prev);
//   }, []);

//   // ✅ Handle manual refresh
//   const handleRefresh = useCallback(async () => {
//     if (refreshData) {
//       try {
//         await refreshData();
//         console.log("✅ Data refreshed successfully");
//       } catch (error) {
//         console.error("❌ Error refreshing data:", error);
//       }
//     }
//   }, [refreshData]);

//   const handleColumnToggle = useCallback((columnName) => {
//     const currentTabKey = categories[currentTab]?.key;
//     if (!currentTabKey) return;
//     setSelectedColumns((prev) => ({
//       ...prev,
//       [currentTabKey]: {
//         ...(prev[currentTabKey] || {}),
//         [columnName]: !(prev[currentTabKey]?.[columnName] ?? true),
//       },
//     }));
//   }, [categories, currentTab]);

//   const setTabColumnNames = useCallback((names) => {
//     const currentTabKey = categories[currentTab]?.key;
//     if (!currentTabKey || !Array.isArray(names)) return;

//     setColumnNames(names);

//     setSelectedColumns((prev) => {
//       const existingSelections = prev[currentTabKey] || {};
//       const newSelections = names.reduce((acc, name) => {
//         acc[name] = name in existingSelections ? existingSelections[name] : true;
//         return acc;
//       }, {});
//       return { ...prev, [currentTabKey]: newSelections };
//     });
//   }, [currentTab, categories]);

//   const getSelectedColumns = useCallback(() => {
//     const currentTabKey = categories[currentTab]?.key;
//     if (!currentTabKey) return [];

//     const currentSelections = selectedColumns[currentTabKey] || {};
//     const selected = Object.keys(currentSelections).filter(
//       (col) => currentSelections[col]
//     );

//     if (selected.includes('symbol')) {
//       return ['symbol', ...selected.filter(col => col !== 'symbol')];
//     }

//     return selected;
//   }, [categories, currentTab, selectedColumns]);

//   // const handleTabChange = (index) => {
//   //   if (isInitialDataLoaded) {
//   //     setCurrentTab(index);
//   //   }
//   // };

//   const fyersAccessToken = localStorage.getItem("fyers_access_token");

//   // if (!fyersAccessToken) {
//   //   return <div className="text-center">Please connect your broker...</div>;
//   // }

//   return (
//     <div className="flex h-[60vh] w-full">
//       <div className="w-full">
//         <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
//           <div className="flex justify-between items-center">
//             <TabList className="flex gap-4">
//               {categories.map(({ name }) => (
//                 <Tab
//                   key={name}
//                   className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10 data-[hover]:bg-gray-300 dark:data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-gray-300 dark:data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
//                 >
//                   {name}
//                 </Tab>
//               ))}
//             </TabList>

//             <button
//               onClick={toggleFilter}
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
//             >
//               <RiMenuLine className="w-5 h-5" />
//             </button>
//           </div>

//           {showFilter && (
//             <div
//               ref={filterRef}
//               className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow absolute right-0 z-10"
//               style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}
//             >
//               <h3 className="font-semibold mb-2">Select columns:</h3>

//               <div className="flex flex-col gap-2">
//                 {columnNames.map((columnName) => (
//                   <label key={columnName} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedColumns[categories[currentTab].key]?.[
//                         columnName
//                         ] ?? true
//                       }
//                       onChange={() => handleColumnToggle(columnName)}
//                       className="mr-2"
//                     />

//                     <span className="text-sm">{columnName}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-3 overflow-hidden h-[55vh] rounded-lg auth">
//             <TabPanels className="h-full">
//               {categories.map(({ name, component: Component }) => (
//                 <TabPanel
//                   key={name}
//                   className="rounded-xl p-3 overflow-y-auto"
//                 >
//                   <Component
//                     selectedColumns={getSelectedColumns()}
//                     setColumnNames={setTabColumnNames}
//                   />
//                 </TabPanel>
//               ))}
//             </TabPanels>
//           </div>
//         </TabGroup>
//       </div>
//     </div>
//   );
// };

// export default StockDetails;






/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////


// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
// import HoldingsTable from "./HoldingsTable";
// import FundsTable from "./FundsTable";
// import OrdersTable from "./OrdersTable";
// import TradesTable from "./TradesTable";
// import PositionsTable from "./PositionTable";
// import { RiMenuLine } from "react-icons/ri";
// // import api from "../../../../config.js";
// // import { useSelector } from "react-redux";
// import { useData } from "../../../../contexts/FyersDataContext";

// const StockDetails = () => {
//   // const [ordersCount, setOrdersCount] = useState(0);
//   // const [positionsCount, setPositionsCount] = useState(0);
//   // const [holdingsCount, setHoldingsCount] = useState(0);
//   const [showFilter, setShowFilter] = useState(false);
//   const [columnNames, setColumnNames] = useState([]);
//   const [selectedColumns, setSelectedColumns] = useState({});
//   const [currentTab, setCurrentTab] = useState(0);
//   const filterRef = useRef(null);
//   //  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
//   //  const { currentUser } = useSelector((state) => state.user);

//   const {
//     holdings = [],
//     positions = {},
//     orders = [],
//     trades = [],
//     funds = {},
//     loading,
//     refreshData
//   } = useData();

//   const categories = useMemo(() => [
//     {
//       name: `Orders (${orders.length || 0})`,
//       component: OrdersTable,
//       key: "orders",
//     },
//     {
//       name: `All Positions (${positions.length || 0})`,
//       component: PositionsTable,
//       key: "positions",
//     },
//     {
//       name: `Trades  (${trades.length || 0})`,
//       component: TradesTable,
//       key: "trades",
//     },
//     {
//       name: `Holdings (${holdings.length || 0})`,
//       component: HoldingsTable,
//       key: "holdings",
//     },
//     {
//       name: "Funds",
//       component: FundsTable,
//       key: "funds"
//     },
//   ], [holdings.length, positions.length, orders.length]);



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

//   const toggleFilter = () => {
//     setShowFilter(!showFilter);
//   };

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
//   }, [currentTab, categories]);

//   const getSelectedColumns = useCallback(() => {
//     const currentTabKey = categories[currentTab].key;
//     const currentSelections = selectedColumns[currentTabKey] || {};
//     const selected = Object.keys(currentSelections).filter(
//       (col) => currentSelections[col]
//     );

//     if (selected.includes('symbol')) {
//       return ['symbol', ...selected.filter(col => col !== 'symbol')];
//     }

//     return selected;
//   }, [categories, currentTab, selectedColumns]);

//   // const handleTabChange = (index) => {
//   //   if (isInitialDataLoaded) {
//   //     setCurrentTab(index);
//   //   }
//   // };

//   const fyersAccessToken = localStorage.getItem("fyers_access_token");

//   // if (!fyersAccessToken) {
//   //   return <div className="text-center">Please connect your broker...</div>;
//   // }

//   return (
//     <div className="flex h-[60vh] w-full">
//       <div className="w-full">
//         <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
//           <div className="flex justify-between items-center">
//             <TabList className="flex gap-4">
//               {categories.map(({ name }) => (
//                 <Tab
//                   key={name}
//                   className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10 data-[hover]:bg-gray-300 dark:data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-gray-300 dark:data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
//                 >
//                   {name}
//                 </Tab>
//               ))}
//             </TabList>

//             <button
//               onClick={toggleFilter}
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
//             >
//               <RiMenuLine className="w-5 h-5" />
//             </button>
//           </div>

//           {showFilter && (
//             <div
//               ref={filterRef}
//               className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow absolute right-0 z-10"
//               style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}
//             >
//               <h3 className="font-semibold mb-2">Select columns:</h3>

//               <div className="flex flex-col gap-2">
//                 {columnNames.map((columnName) => (
//                   <label key={columnName} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedColumns[categories[currentTab].key]?.[
//                         columnName
//                         ] ?? true
//                       }
//                       onChange={() => handleColumnToggle(columnName)}
//                       className="mr-2"
//                     />

//                     <span className="text-sm">{columnName}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-3 overflow-hidden h-[55vh] rounded-lg auth">
//             <TabPanels className="h-full">
//               {categories.map(({ name, component: Component }) => (
//                 <TabPanel
//                   key={name}
//                   className="rounded-xl p-3 overflow-y-auto"
//                 >
//                   <Component
//                     selectedColumns={getSelectedColumns()}
//                     setColumnNames={setTabColumnNames}
//                   />
//                 </TabPanel>
//               ))}
//             </TabPanels>
//           </div>
//         </TabGroup>
//       </div>
//     </div>
//   );
// };

// export default StockDetails;