import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import HoldingsTable from "./HoldingsTable";
import FundsTable from "./FundsTable";
import OrdersTable from "./OrdersTable";
import TradesTable from "./TradesTable";
import PositionsTable from "./PositionTable";
import { RiMenuLine } from "react-icons/ri";
// import api from "../../../../config.js";
// import { useSelector } from "react-redux";
import { useData } from "../../../../contexts/FyersDataContext";

const StockDetails = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const {
    holdings = { holdings: [] },
    positions = { netPositions: [] },
    orders = { orderBook: [] },
    loading
  } = useData();

  // Categories with counts
  const categories = useMemo(() => [
    {
      name: `Orders (${orders.orderBook?.length || 0})`,
      component: OrdersTable,
      key: "orders",
    },
    {
      name: `All Positions (${positions.netPositions?.length || 0})`,
      component: PositionsTable,
      key: "positions",
    },
    {
      name: "Trades",
      component: TradesTable,
      key: "trades",
    },
    {
      name: `Holdings (${holdings.holdings?.length || 0})`,
      component: HoldingsTable,
      key: "holdings",
    },
    {
      name: "Funds",
      component: FundsTable,
      key: "funds"
    },
  ], [holdings.holdings?.length, positions.netPositions?.length, orders.orderBook?.length]);

  // const fetchAllCounts = async () => {
  //   try {
  //     const fyersAccessToken = localStorage.getItem("fyers_access_token");
  //     const headers = { Authorization: `Bearer ${fyersAccessToken}` };

  //     const [ordersResponse, positionsResponse, holdingsResponse] = await Promise.all([
  //       api.get(`/api/v1/fyers/ordersByUserId/${currentUser.id}`, { headers }),
  //       api.get(`/api/v1/fyers/positionsByUserId/${currentUser.id}`, { headers }),
  //       api.get(`/api/v1/fyers/holdingsByUserId/${currentUser.id}`, { headers }),
  //     ]);

  //     setOrdersCount(ordersResponse.data.orderBook.length);
  //     setPositionsCount(positionsResponse.data.netPositions.length);
  //     setHoldingsCount(holdingsResponse.data.holdings.length);
  //   } catch (error) {
  //     console.error("Error fetching counts:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllCounts();
  //   const interval = setInterval(fetchAllCounts, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   if (!loading) {
  //     setOrdersCount(orders.orderBook?.length || 0);
  //     setPositionsCount(positions.netPositions?.length || 0);
  //     setHoldingsCount(holdings.holdings?.length || 0);
  //   }
  // }, [orders, positions, holdings, loading]);

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

  const handleColumnToggle = useCallback((columnName) => {
    const currentTabKey = categories[currentTab].key;
    setSelectedColumns((prev) => ({
      ...prev,
      [currentTabKey]: {
        ...prev[currentTabKey],
        [columnName]: !prev[currentTabKey][columnName],
      },
    }));
  }, [categories, currentTab]);

  const setTabColumnNames = useCallback((names) => {
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
  }, [currentTab, categories]);

  const getSelectedColumns = useCallback(() => {
    const currentTabKey = categories[currentTab].key;
    const currentSelections = selectedColumns[currentTabKey] || {};
    const selected = Object.keys(currentSelections).filter(
      (col) => currentSelections[col]
    );

    if (selected.includes('symbol')) {
      return ['symbol', ...selected.filter(col => col !== 'symbol')];
    }

    return selected;
  }, [categories, currentTab, selectedColumns]);

  // const handleTabChange = (index) => {
  //   if (isInitialDataLoaded) {
  //     setCurrentTab(index);
  //   }
  // };

  const fyersAccessToken = localStorage.getItem("fyers_access_token");

  // if (!fyersAccessToken) {
  //   return <div className="text-center">Please connect your broker...</div>;
  // }
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="w-full h-full rounded-xl">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab} className="h-full flex flex-col">
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 shrink-0">
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
                  {name}
                </Tab>
              ))}
            </TabList>

            <button
              ref={filterButtonRef}
              onClick={toggleFilter}
              className="hidden sm:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <RiMenuLine className="w-5 h-5" />
            </button>            {showFilter && (
              <div
                ref={filterDropdownRef}
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

          <div className="overflow-hidden rounded-lg h-[calc(100%-4rem)]">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component }) => (
                <TabPanel key={name} className="rounded-xl p-2 overflow-y-auto h-full">
                  <Component
                    selectedColumns={getSelectedColumns()}
                    setColumnNames={setTabColumnNames}
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