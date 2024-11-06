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
  onSelect,
}) {

  let typeBackground;
  
  switch (type) {
    case "SME":
      typeBackground = {
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #886627 132.95%)",
        borderImageSource:
          "linear-gradient(180deg, rgba(136, 102, 39, 0.4) 17.19%, rgba(251, 203, 98, 0.77) 100%)",
        boxShadow:
          "inset 0px 8.97px 26.92px 0px #FFB949B2, 0px 8.97px 35.9px 0px #AF733F80",
      };
      break;
    case "DEBT":
      typeBackground = {
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #882776 132.95%)",
        borderImageSource:
          "linear-gradient(180deg, rgba(136, 39, 118, 0.4) 17.19%, rgba(251, 98, 241, 0.77) 100%)",
        boxShadow:
          "inset 0px 8.97px 26.92px 0px #FF49F3B2, 0px 8.97px 35.9px 0px #AF3FA080",
      };
      break;
    case "EQUITY":
      typeBackground = {
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B5C0C 132.95%)",
        border: "0.9px solid transparent",
        borderImageSource: `
          linear-gradient(180deg, rgba(11, 92, 12, 0.4) 17.19%, rgba(98, 251, 108, 0.77) 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(180deg, rgba(11, 92, 12, 0) -4.69%, rgba(189, 254, 191, 0.3) 100%)
        `,
        borderImageSlice: "1",
        boxShadow:
          "0px 8.97px 26.92px 0px #49FF4FB2 inset, 0px 8.97px 35.9px 0px #0B5C0C80",
        backdropFilter: "blur(17.94871711730957px)",
      };
      break;
    default:
      typeBackground = "";
      break;
  }

  return (
    <div
      className="rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-gray-600 cursor-pointer"
      onClick={() => onSelect(company)}
    >
      {" "}
      {/* Hover effects */}
      <div className="news-table rounded-t-md flex items-center justify-between py-3 px-4">
        <img className="h-10 w-12" loading="lazy" src={logo} alt="logo" />

        <div className="w-[40%] ">
          <h2 className="text-sm text-black dark:text-[#FFFFFF]">{name}</h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            {company}
          </p>{" "}
        </div>

        <div className="w-[40%]">
          <h2 className="text-sm text-black dark:text-[#FFFFFF]">{ipoDate}</h2>
          <p className="text-xs text-black dark:text-[#FFFFFFB2]">
            IPO Date
          </p>{" "}
        </div>

        <div className="w-[25%]">
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
