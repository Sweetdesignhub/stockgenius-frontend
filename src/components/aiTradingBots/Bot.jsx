import React from "react";
import { Switch } from "@headlessui/react";

// New component for Trade Ratio Bar
const TradeRatioBar = ({ ratio }) => {
  const percentage = parseFloat(ratio);
  const greenPercentage = percentage.toFixed(1);
  const redPercentage = (100 - percentage).toFixed(1);
  return (
    <div className="w-32">
      <div className="flex justify-between mb-1">
        <span className="text-[#00FF47] font-semibold text-xs">
          {greenPercentage}%
        </span>
        <span className="text-[#FF0000] font-semibold text-xs">
          {redPercentage}%
        </span>
      </div>
      <div className="w-full h-1.5 flex rounded-full overflow-hidden">
        <div
          style={{ width: `${greenPercentage}%` }}
          className="h-full bg-[#00FF47]"
        ></div>
        <div
          style={{ width: `${redPercentage}%`, backgroundColor: "#FF0000" }}
          className="h-full"
        ></div>
      </div>
    </div>
  );
};

function Bot({ botData, isEnabled, onToggle, currentStatus }) {
  const data = botData.dynamicData.map((item) =>
    item.title === "Status"
      ? {
          ...item,
          value: currentStatus,
          valueColor:
            currentStatus === "Inactive"
              ? "#FF4D4D"
              : currentStatus === "Running"
              ? "#00FF47"
              : "#FFBF00",
        }
      : item
  );

  return (
    <div
      style={{
        boxShadow:
          "0px 9.67px 29.02px 0px #497BFFB2 inset, 0px 9.67px 38.7px 0px #3F4AAF80",
        borderImageSource:
          "linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), " +
          "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), " +
          "linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)",
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
      }}
      className="rounded-xl p-5 flex flex-col lg:flex-row w-full"
    >
      <div className="flex flex-col items-center lg:items-start lg:w-1/4 w-full">
        <div className="flex items-center">
          <h1 className="mr-2">{botData.name}</h1>
          <img src={botData.image} alt={`${botData.name} logo`} className="" />
        </div>
        <div className="py-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <h3 className="font-semibold text-md mr-2 text-[#63ECFF]">
              Profit % : <span>{botData.profitPercentage}%</span>
            </h3>
            <h3 className="font-semibold text-md text-[#FBFF4E]">
              Risk % : <span>{botData.riskPercentage}%</span>
            </h3>
          </div>
          <h3 className="text-sm text-[#FFA8A8]">{botData.market}</h3>
          <p className="text-[10px] mt-1 text-[#A6B2CD]">{botData.timestamp}</p>
          <p className="text-sm mt-2 text-[#63ECFF]">
            Product Type: {botData.productType}
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <img
            src={botData.extraImage}
            alt="Extra Info"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center lg:justify-start lg:w-[60%] w-full px-4 mt-4 lg:mt-0">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center lg:items-start justify-center w-1/2 sm:w-1/3 lg:w-1/5 mb-4"
          >
            <h1 className="text-[#A6B2CDB2] text-xs mb-1">{item.title}</h1>
            {item.title === "Trade Ratio" ? (
              <TradeRatioBar ratio={item.value} />
            ) : (
              <p
                className="text-sm font-semibold"
                style={{ color: item.valueColor }}
              >
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="w-full lg:w-[15%] flex justify-center lg:justify-end mt-4 lg:mt-0">
        <Switch
          checked={isEnabled && currentStatus !== "Inactive"}
          onChange={onToggle}
          className="group relative flex h-6 w-14 cursor-pointer rounded-md bg-[#F01313] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#37DD1C]"
        >
          <span
            className={`absolute right-2 top-1 text-xs font-semibold transition-opacity duration-200 ${
              isEnabled && currentStatus !== "Inactive"
                ? "opacity-0"
                : "opacity-100"
            }`}
          >
            OFF
          </span>

          <span
            className={`absolute left-2 top-1 text-xs font-semibold transition-opacity duration-200 ${
              isEnabled && currentStatus !== "Inactive"
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            ON
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block w-4 h-4 translate-x-0 rounded-sm bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
          />
        </Switch>
      </div>
    </div>
  );
}

export default Bot;
