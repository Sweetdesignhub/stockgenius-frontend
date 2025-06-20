import React from "react";
import AccountDetailsPT from "../../components/paperTrading/AccountDetailsPT";
import { useSelector } from "react-redux";
import AiDrivenList from "../../components/paperTrading/AiDrivenList";
import DailyUpdates from "../../components/paperTrading/DailyUpdates";
import { Link } from "react-router-dom";

function PaperTrading() {
  const { currentUser } = useSelector((state) => state.user);

  return (    <div className="-z-10">
      <div className="min-h-fit lg:px-32 p-4 relative">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="Bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="Bear"
        /><div className="bg-white h-full  mx-auto news-table rounded-2xl py-2 px-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg mb-4 lg:mb-0 lg:mr-4 text-center md:text-left">
              Welcome to your trading adventure! Let’s set you up for success.
            </h1>
            <div className="flex gap-3">
              <div className="relative group">
                <Link to={"/india/paper-trading/portfolio"}>
                  <div className="bg-white rounded-2xl px-4 py-1">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F1724f58fc6384ce29b80e805d16be7d8"
                      alt="portfolio"
                    />
                  </div>
                </Link>
                <span className="absolute bottom-10 left-0 right-0 text-center font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Portfolio
                </span>
              </div>

              <div className="relative group">
                <Link to={"/india/paper-trading/auto-trade"}>
                  <div className="bg-white rounded-2xl px-4 py-1 cursor-pointer">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd8fe962448c0436eb22de11f97927855"
                      alt="Auto TradeBot"
                    />
                  </div>
                </Link>
                <span className="absolute bottom-10 left-[-5px] right-0 text-center font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Auto TradeBot
                </span>
              </div>
            </div>
          </div>          {/* Content Section */}          
          <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
            {/* Left Side */}
            <div className="w-full md:w-[60%] flex flex-col gap-4 h-full">
              <AccountDetailsPT
                userId={currentUser.id}
                className="flex-shrink-0"
              />
              <div className="flex-grow min-h-0">
                <AiDrivenList className="h-full" />
              </div>
            </div>

            {/* Right Side */}            
            <div className="w-full md:w-[40%] h-full">
              <DailyUpdates />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaperTrading;