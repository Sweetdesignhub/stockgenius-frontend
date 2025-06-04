import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HeaderPT() {
  const region = useSelector((state) => state.region);
  const regionPath = region === "usa" ? "usa" : "india"; // Dynamic region path

  return (    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-2 border-b">
      <h1 className="font-[poppins] font-semibold text-lg sm:text-base lg:text-lg order-1 sm:order-none">
        Account Manager
      </h1>
      <div className="flex gap-3 order-2 sm:order-none">
        <div className="relative group">
          <Link to={`/${regionPath}/paper-trading/auto-trade`}>
            <div className="bg-white rounded-2xl px-3 sm:px-4 py-2 sm:py-1 cursor-pointer shadow-sm">
              <img
                loading="lazy"
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-auto lg:h-auto"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd8fe962448c0436eb22de11f97927855"
                alt="Auto Trade"
              />
            </div>
          </Link>          <span className="absolute -bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 text-center text-[10px] sm:text-xs lg:text-sm font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Auto TradeBot
          </span>
        </div>
        <div className="relative group">
          <Link to={`/${regionPath}/paper-trading`}>
            <div className="bg-[#3A6FF8] rounded-2xl px-3 sm:px-4 py-2 sm:py-1 shadow-sm">
              <img
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-auto lg:h-auto"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775"
                alt="Paper Trading"
              />
            </div>
          </Link>
          <span className="absolute -bottom-6 sm:bottom-11 left-1/2 transform -translate-x-1/2 text-center text-[10px] sm:text-xs lg:text-sm font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Paper Trading
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderPT;
