import React from "react";

function IPOCard({
  logo,
  name,
  company,
  ipoDate,
  listingDate,
  type,
  sentimentScore,
  decisionRate,
  priceRange,
  minQuantity,
  typeBackground,
  onSelect,
}) {
  return (
    <div className="rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-gray-600 cursor-pointer"  onClick={() => onSelect(company)}  >
      {" "}
      {/* Hover effects */}
      <div className="news-table rounded-t-md flex items-center justify-between py-3 px-4">
        <img className="h-10 w-10" loading="lazy" src={logo} alt="logo" />

        <div className="w-[35%] ">
          <h2 className="text-sm text-black dark:text-[#FFFFFF]">{name}</h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            {company}
          </p>{" "}
          
        </div>

        <div className="w-[50%]">
          <h2 className="text-sm text-black dark:text-[#FFFFFF]">{ipoDate}</h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            IPO Date
          </p>{" "}
    
        </div>

        <div className="w-[30%]">
          <h2 className="text-sm text-black dark:text-[#FFFFFF]">
            {listingDate}
          </h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            Listing Date
          </p>{" "}
        
        </div>

        <div
          className="w-[12%] px-[6px] py-[2px] text-center rounded-lg"
          style={typeBackground}
        >
          <h2 className="text-[#FFF7D7] text-xs">{type}</h2>
        </div>
      </div>
      <div className="px-4 py-2 table-main flex items-center justify-between">
        <div className="w-1/4 text-center">
          <h2 className="text-xs font-semibold text-[#F2BD0F]">
            {sentimentScore}
          </h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            Sentiment Score
          </p>{" "}
          
        </div>
        <div className="w-1/4 text-center">
          <h2 className="text-xs font-semibold text-[#0DFFB2]">
            {decisionRate}%
          </h2>
          <p className="text-xs text-black dark:text-[#0DFFB2B2]">
            Decision Rate
          </p>{" "}
          
        </div>
        <div className="w-1/4 text-center">
          <h2 className="text-xs font-semibold text-[#F8E83A]">{priceRange}</h2>
          <p className="text-xs text-black dark:text-[#F8E83AB2]">
            Price Range
          </p>{" "}
     
        </div>
        <div className="w-1/4 text-center">
          <h2 className="text-xs font-semibold text-[#ACFF46]">
            {minQuantity}
          </h2>
          <p className="text-xs text-black dark:text-[#ACFF46B2]">
            Min. Quantity
          </p>{" "}
          
        </div>
      </div>
    </div>
  );
}

export default IPOCard;
