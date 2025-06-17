// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext";
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

//   const { funds, holdings, positions, trades, orders, loading, error } =
//     usePaperTrading();

//   // Stable memoization of categories
//   const categories = useMemo(
//     () => [
//       {
//         name: `Orders (${orders?.length || 0})`,
//         component: OrdersPT,
//         key: "orders",
//       },
//       {
//         name: `All Positions (${positions?.length || 0})`,
//         component: PositionsPT,
//         key: "positions",
//       },
//       {
//         name: `Trades (${trades?.length || 0})`,
//         component: TradesPT,
//         key: "trades",
//       },
//       {
//         name: `Holdings (${holdings?.length || 0})`,
//         component: HoldingsPT,
//         key: "holdings",
//       },
//       {
//         name: "Funds",
//         component: FundsPT,
//         key: "funds",
//       },
//     ],
//     [
//       orders?.length,
//       positions?.netPositions?.length,
//       trades?.length,
//       holdings?.length,
//     ]
//   );

//   // Handle clicks outside filter dropdown
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

//   const handleColumnToggle = useCallback(
//     (columnName) => {
//       const currentTabKey = categories[currentTab].key;
//       setSelectedColumns((prev) => ({
//         ...prev,
//         [currentTabKey]: {
//           ...prev[currentTabKey],
//           [columnName]: !prev[currentTabKey][columnName],
//         },
//       }));
//     },
//     [categories, currentTab]
//   );

//   const setTabColumnNames = useCallback(
//     (names) => {
//       const currentTabKey = categories[currentTab].key;
//       setColumnNames(names);

//       setSelectedColumns((prev) => {
//         const existingSelections = prev[currentTabKey] || {};
//         const newSelections = names.reduce((acc, name) => {
//           acc[name] =
//             name in existingSelections ? existingSelections[name] : true;
//           return acc;
//         }, {});
//         return { ...prev, [currentTabKey]: newSelections };
//       });
//     },
//     [categories, currentTab]
//   );

//   const getSelectedColumns = useCallback(() => {
//     const currentTabKey = categories[currentTab].key;
//     const currentSelections = selectedColumns[currentTabKey] || {};
//     const selected = Object.keys(currentSelections).filter(
//       (col) => currentSelections[col]
//     );

//     if (selected.includes("symbol")) {
//       return ["symbol", ...selected.filter((col) => col !== "symbol")];
//     }

//     return selected;
//   }, [categories, currentTab, selectedColumns]);

//   return (
//     <div className="flex w-full">
//       <div className="w-full">
//         <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
//           <div className="flex justify-between items-center flex-wrap">
//             <TabList className="flex gap-4 flex-wrap">
//               {categories.map(({ name }) => (
//                 <Tab
//                   key={name}
//                   className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10 data-[hover]:bg-gray-300 dark:data-[hover]:bg-white/5"
//                 >
//                   {name}
//                 </Tab>
//               ))}
//             </TabList>
//             <button
//               onClick={toggleFilter}
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
//             >
//               {/* <RiMenuLine className="w-5 h-5" /> */}
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
//                           columnName
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
//           <div className="mt-3 overflow-hidden h-[55vh] rounded-lg">
//             <TabPanels className="h-full">
//               {categories.map(({ name, component: Component }) => (
//                 <TabPanel key={name} className="rounded-xl p-3 overflow-y-auto">
//                   <Component
//                     selectedColumns={getSelectedColumns()}
//                     setColumnNames={setTabColumnNames}
//                     data={{
//                       positions: positions?.netPositions,
//                       trades: trades,
//                       orders: orders,
//                       holdings: holdings,
//                       funds: funds,
//                     }}
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

// export default StockDetailsPT;

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext";
import { useUsaPaperTrading } from "../../../contexts/UsaPaperTradingContext";
import { RiMenuLine } from "react-icons/ri";
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
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const region = useSelector((state) => state.region);

  const { funds, holdings, positions, trades, orders, loading, error } =
    region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  // Stable memoization of categories
  const categories = useMemo(
    () => [
      {
        name: `Orders (${orders?.length || 0})`,
        component: OrdersPT,
        key: "orders",
      },
      {
        name: `All Positions (${positions?.length || 0})`,
        component: PositionsPT,
        key: "positions",
      },
      {
        name: `Trades (${trades?.length || 0})`,
        component: TradesPT,
        key: "trades",
      },
      {
        name: `Holdings (${holdings?.length || 0})`,
        component: HoldingsPT,
        key: "holdings",
      },
      {
        name: "Funds",
        component: FundsPT,
        key: "funds",
      },
    ],
    [orders?.length, positions?.length, trades?.length, holdings?.length]
  );

  // Handle clicks outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target) &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showFilter]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleColumnToggle = useCallback(
    (columnName) => {
      const currentTabKey = categories[currentTab].key;
      setSelectedColumns((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          [columnName]: !(prev[currentTabKey]?.[columnName] ?? true),
        },
      }));
    },
    [categories, currentTab]
  );

  const setTabColumnNames = useCallback(
    (names) => {
      const currentTabKey = categories[currentTab].key;
      setColumnNames(names);

      setSelectedColumns((prev) => {
        const existingSelections = prev[currentTabKey] || {};
        const newSelections = names.reduce((acc, name) => {
          acc[name] =
            name in existingSelections ? existingSelections[name] : true;
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
    const selected = Object.keys(currentSelections).filter(
      (col) => currentSelections[col]
    );

    if (selected.includes("symbol")) {
      return ["symbol", ...selected.filter((col) => col !== "symbol")];
    }

    return selected;
  }, [categories, currentTab, selectedColumns]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="w-full h-full rounded-xl">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab} className="h-full flex flex-col">
          <div className="relative p-3 shrink-0">
            {/* Header container with absolute filter button */}
            <div className="relative flex flex-wrap gap-2 sm:gap-4">
              <TabList className="flex flex-wrap gap-2 sm:gap-4">
                {categories.map(({ name }) => (
                  <Tab
                    key={name}
                    className={({ selected }) => `
                      rounded-full py-1.5 px-3 text-xs sm:text-sm font-semibold 
                      focus:outline-none whitespace-nowrap
                      ${selected 
                        ? 'bg-[#3A6FF8] text-white dark:port'
                        : 'text-gray-600 dark:text-gray-300 tab-hover'
                      }
                    `}
                  >
                    <span className="flex items-center gap-1">
                      {name}
                    </span>
                  </Tab>
                ))}
              </TabList>
            </div>

            {/* Filter button - hidden in mobile, visible in desktop */}
            <div className="hidden sm:block sm:absolute sm:right-3 sm:top-3">
              <button
                ref={filterButtonRef}
                onClick={toggleFilter}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle column filter"
              >
                <RiMenuLine className="w-5 h-5" />
              </button>

              {/* Filter dropdown */}
              {showFilter && (
                <div                  ref={filterDropdownRef}
                  className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-4 z-50 border dark:border-white/10 border-gray-200 w-[200px] overflow-y-auto"
                  style={{ maxHeight: 'calc(50vh - 120px)' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold dark:text-white text-sm">Select columns:</h3>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      aria-label="Close filter"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {columnNames.map((columnName) => (
                      <label 
                        key={columnName} 
                        className="flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns[categories[currentTab].key]?.[columnName] ?? true}
                          onChange={() => handleColumnToggle(columnName)}
                          className="mr-3 w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm dark:text-gray-300">{columnName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg h-[calc(100%-4rem)]">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component }) => (
                <TabPanel key={name} className="rounded-xl p-2 overflow-y-auto h-full">
                  <Component
                    selectedColumns={getSelectedColumns()}
                    setColumnNames={setTabColumnNames}
                    data={{
                      positions: positions?.netPositions,
                      trades: trades,
                      orders: orders,
                      holdings: holdings,
                      funds: funds,
                    }}
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

export default StockDetailsPT;
