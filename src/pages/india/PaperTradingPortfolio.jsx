import React from "react";
import AccountInfoPT from "../../components/paperTrading/portfolio/AccountInfoPT";
import StockDetailsPT from "../../components/paperTrading/portfolio/StockDetailsPT";
import HeaderPT from "../../components/paperTrading/portfolio/HeaderPT";

function PaperTradingPortfolio() {
  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative page-scrollbar">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="bear"
        />

        <div className="bg-white min-h-[85vh] news-table rounded-2xl">
          <div className="py-5 px-5 flex flex-col rounded-2xl">
            <HeaderPT />
            <AccountInfoPT />
            <StockDetailsPT />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaperTradingPortfolio;
