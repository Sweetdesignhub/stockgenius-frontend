import React from "react";
import AccountDetailsPT from "../../components/paperTrading/AccountDetailsPT";
import { useSelector } from "react-redux";
import AiDrivenList from "../../components/paperTrading/AiDrivenList";
import DailyUpdates from "../../components/paperTrading/DailyUpdates";
import { Link } from "react-router-dom";

function PaperTrading() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
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

        <div className="bg-white min-h-[85vh] max-h-[85vh] news-table rounded-2xl py-2 px-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="flex items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg mb-4 lg:mb-0 lg:mr-4">
              Welcome to your trading adventure! Let’s set you up for success.
            </h1>
            {/* <button className="bg-white text-red-500 rounded-2xl px-4 font-semibold text-sm py-1">
              Filter
            </button> */}
            <div className="flex gap-3">
              <Link to={"/india/paper-trading/portfolio"}>
                <div className="bg-white rounded-2xl px-4 py-1">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F1724f58fc6384ce29b80e805d16be7d8"
                    alt="portfolio"
                  />
                </div>
              </Link>

              <div className="bg-white rounded-2xl px-4 py-1 cursor-pointer">
                <Link to={"/india/paper-trading/auto-trade"}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd8fe962448c0436eb22de11f97927855"
                    alt="portfolio"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex gap-4 flex-grow overflow-hidden">
            {/* Left Side */}
            <div className="w-[60%] flex flex-col gap-4 overflow-hidden">
              <AccountDetailsPT
                userId={currentUser.id}
                className="flex-shrink-0"
              />
              <AiDrivenList className="flex-grow overflow-auto" />
            </div>

            {/* Right Side */}
            <div className="w-[40%]">
              <DailyUpdates />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaperTrading;
