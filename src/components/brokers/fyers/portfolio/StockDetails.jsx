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
  // const [ordersCount, setOrdersCount] = useState(0);
  // const [positionsCount, setPositionsCount] = useState(0);
  // const [holdingsCount, setHoldingsCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const filterRef = useRef(null);
  //  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  //  const { currentUser } = useSelector((state) => state.user);

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
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  return (    <div className="flex flex-col w-full overflow-hidden max-h-[calc(100vh-14rem)] lg:max-h-[calc(100vh-16rem)] xl:max-h-[calc(100vh-17rem)] 2xl:max-h-[calc(100vh-19rem)]">
      <div className="w-full h-full auth rounded-xl">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab} className="h-full flex flex-col">
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 shrink-0">
            <TabList className="flex flex-wrap gap-2 sm:gap-4">
              {categories.map(({ name, count }) => (
                <Tab
                  key={name}
                  className={({ selected }) => `
                    rounded-full py-1.5 px-3 text-xs sm:text-sm font-semibold 
                    transition-all duration-200 ease-in-out
                    focus:outline-none whitespace-nowrap
                    ${selected 
                      ? 'bg-gray-100 dark:bg-white/10 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                    }
                  `}
                >
                  <span className="flex items-center gap-1">
                    {name}
                    {typeof count !== 'undefined' && (
                      <span className={`${
                        count > 0 ? 'bg-blue-500' : 'bg-gray-500'
                      } text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center`}>
                        {count}
                      </span>
                    )}
                  </span>
                </Tab>
              ))}
            </TabList>

            <button
              ref={filterRef}
              onClick={toggleFilter}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <RiMenuLine className="w-5 h-5" />
            </button>

            {showFilter && (
              <div
                className="absolute right-0 top-12 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-4 z-20 border dark:border-white/10 border-gray-200"
                style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}
              >
                <h3 className="font-semibold mb-2 dark:text-white">Select columns:</h3>
                <div className="flex flex-col gap-2">
                  {columnNames.map((columnName) => (
                    <label key={columnName} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedColumns[categories[currentTab].key]?.[
                            columnName
                          ] ?? true
                        }
                        onChange={() => handleColumnToggle(columnName)}
                        className="mr-2"
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