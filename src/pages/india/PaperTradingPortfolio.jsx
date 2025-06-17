import React from "react";
import AccountInfoPT from "../../components/paperTrading/portfolio/AccountInfoPT";
import StockDetailsPT from "../../components/paperTrading/portfolio/StockDetailsPT";
import HeaderPT from "../../components/paperTrading/portfolio/HeaderPT";

function PaperTradingPortfolio() {
  return (
    <div className="-z-10">
      <div className="min-h-fit lg:px-32 p-4 relative ">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F87dfd2fd4eea4f378d9e578d4c5dd7d0"
          alt="bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9815d9f59dfd4f65b9e50d5dcbb0152c"
          alt="bear"
        /> 
        
        <div className=" sbg-white/5 dark:bg-[rgba(5,5,5,0.2)] backdrop-blur-md table-main rounded-2xl border  border-white/10">
          <div className="py-2 sm:py-3 md:py-4 lg:py-5 px-2 sm:px-3 md:px-4 lg:px-5 flex flex-col rounded-2xl">
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
