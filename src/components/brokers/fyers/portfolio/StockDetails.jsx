import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import HoldingsTable from "./HoldingsTable";
import FundsTable from "./FundsTable";
import OrdersTable from "./OrdersTable";
import TradesTable from "./TradesTable";
import PositionsTable from "./PositionTable";

const categories = [
  { name: "Orders", component: OrdersTable },
  { name: "All Positions", component: PositionsTable },
  { name: "Trades", component: TradesTable },
  { name: "Holdings", component: HoldingsTable },
  { name: "Funds", component: FundsTable },
];

const StockDetails = () => {
  return (
    <div className="flex h-[60vh] w-full">
      <div className="w-full">
        <TabGroup>
          <TabList className="flex gap-4">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <div className="mt-3 overflow-hidden h-[55vh] rounded-lg auth">
            <TabPanels className="h-full">
              {categories.map(({ name, component: Component }) => (
                <TabPanel key={name} className="rounded-xl p-3 overflow-y-auto">
                  <Component />
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
