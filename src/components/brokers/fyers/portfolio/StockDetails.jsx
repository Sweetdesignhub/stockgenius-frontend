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

  return (
    <div className="flex h-[60vh] w-full">
      <div className="w-full">
        <TabGroup selectedIndex={currentTab} onChange={setCurrentTab}>
          <div className="flex justify-between items-center">
            <TabList className="flex gap-4">
              {categories.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none data-[selected]:bg-gray-300 dark:data-[selected]:bg-white/10 data-[hover]:bg-gray-300 dark:data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-gray-300 dark:data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {name}
                </Tab>
              ))}
            </TabList>

            <button
              onClick={toggleFilter}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
            >
              <RiMenuLine className="w-5 h-5" />
            </button>
          </div>

          {showFilter && (
            <div
              ref={filterRef}
              className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow absolute right-0 z-10"
              style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}
            >
              <h3 className="font-semibold mb-2">Select columns:</h3>

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

                    <span className="text-sm">{columnName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 overflow-hidden h-[55vh] rounded-lg auth">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component }) => (
                <TabPanel
                  key={name}
                  className="rounded-xl p-3 overflow-y-auto"
                >
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