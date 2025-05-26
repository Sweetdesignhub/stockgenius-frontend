import React from "react";
import Loading from "../common/Loading";

const IPODetail = ({ theme, ipoData, formatDate }) => {
  const { company, companyDescription, keyObjectives = [],advantages = [], disadvantages = [] } = ipoData || {};
  // console.log(keyObjectives);
  

  const darkThemeStyle = {
    boxShadow: "0px 9.67px 29.02px 0px #497BFFB2 inset, 0px 9.67px 38.7px 0px #3F4AAF80",
    borderImageSource: "linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), " +
                       "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), " +
                       "linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)",
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
  };

  const containerStyle = theme === "dark" ? darkThemeStyle : { backgroundColor: "#3A6FF8" };

  if (!ipoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="news-table min-h-[70vh] overflow-y-scroll scrollbar-hide overflow-x-hidden max-h-[70vh] rounded-xl p-2">
      <div className="mb-3">
        <p className="text-[8px] dark:text-[#FFFFFFB2] text-black">
          Note : Allotment will take place on the listing date after the IPO Bid. After the listing date, the stocks
          will be credited to your demat account if they are allocated. Otherwise, the NSE will release the funds
          held in your bank account if the bid was not awarded.
        </p>
      </div>

      <div style={containerStyle} className="p-4 rounded-lg mb-3 bg-blue-300">
        <h1 className="text-sm text-white font-semibold mb-2">{company}</h1>
        <p className="text-[#B7E5FF] text-xs">{companyDescription}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-3">
      {keyObjectives.length > 0 && keyObjectives.some(obj => obj.title && obj.description) && (
          <div className="sm:w-1/2 w-full table-main rounded-lg p-3">
            <h1 className="text-sm uppercase mb-3 font-semibold">Key Objectives</h1>
            <ol className="list-decimal pl-4">
              {keyObjectives.map((objective, index) => (
                objective.title && objective.description && (
                  <li key={index} className="text-[11px] text-[#E3AE00] mb-1">
                    {objective.title}
                    <p className="dark:text-[#FFFFFFCC] text-black">{objective.description}</p>
                  </li>
                )
              ))}
            </ol>
          </div>
        )}

<div
  style={theme === "dark" ? containerStyle : {}}
  className={`sm:w-1/2 w-full rounded-lg p-3 ${theme === "dark" ? "" : "table-main"}`}
>

          <h1 className="text-sm uppercase mb-3 font-semibold">IPO SCHEDULE</h1>
          <div className="flex flex-col h-36 justify-between">
            <div className="flex items-center justify-between text-[11px]">
              <h1>Opening Date</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.ipoStartDate)}</p>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <h1>Closing Date</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.ipoEndDate)}</p>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <h1>Listing Date</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.listingDate)}</p>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <h1>Basis of Allotment</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.basisOfAllotment)}</p>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <h1>Initiation of Refunds</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.initiationOfRefunds)}</p>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <h1>Credit Shares</h1>
              <p className="text-[#3A6FF8] dark:text-[#A5FCFF]">{formatDate(ipoData.creditShares)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
      {advantages.length > 0 && advantages.some(adv => adv.title && adv.description) && (
          <div className="sm:w-1/2 w-full table-main rounded-lg p-3">
            <h1 className="text-sm uppercase mb-3 font-semibold">ADVANTAGES</h1>
            <ol className="list-decimal pl-4">
              {advantages.map((advantage, index) => (
                advantage.title && advantage.description && (
                  <li key={index} className="text-[9px] text-[#2BCC11] mb-1">
                    {advantage.title}
                    <p className="dark:text-[#FFFFFFCC] text-black">{advantage.description}</p>
                  </li>
                )
              ))}
            </ol>
          </div>
        )}

        {disadvantages.length > 0 && disadvantages.some(disadv => disadv.title && disadv.description) && (
          <div className="sm:w-1/2 w-full table-main rounded-lg p-3">
            <h1 className="text-sm uppercase mb-3 font-semibold">DISADVANTAGES</h1>
            <ol className="list-decimal pl-4">
              {disadvantages.map((disadvantage, index) => (
                disadvantage.title && disadvantage.description && (
                  <li key={index} className="text-[9px] text-[#DB1010] mb-1">
                    {disadvantage.title}
                    <p className="dark:text-[#FFFFFFCC] text-black">{disadvantage.description}</p>
                  </li>
                )
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPODetail;
