import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HeaderPT() {
  const region = useSelector((state) => state.region);
  const regionPath = region === "usa" ? "usa" : "india"; // Dynamic region path

  return (
    <div className="flex flex-wrap justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold text-base lg:text-lg">
        Account Manager
      </h1>
      <div className="flex gap-3 mt-2 lg:mt-0">
        <div className="relative group">
          <Link to={`/${regionPath}/paper-trading/auto-trade`}>
            <div className="bg-white rounded-2xl px-4 py-1 cursor-pointer">
              <img
                loading="lazy"
                className="w-6 h-6 lg:w-auto lg:h-auto"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd8fe962448c0436eb22de11f97927855"
                alt="Auto Trade"
              />
            </div>
          </Link>
          <span className="absolute bottom-10 left-[-25px] right-0 text-center text-xs lg:text-sm font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Auto TradeBot
          </span>
        </div>
        <div className="relative group">
          <Link to={`/${regionPath}/paper-trading`}>
            <div className="bg-[#3A6FF8] rounded-2xl px-4 py-1">
              <img
                className="w-6 h-6 lg:w-auto lg:h-auto"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775"
                alt="Paper Trading"
              />
            </div>
          </Link>
          <span className="absolute bottom-11 left-[-25px] right-0 text-center text-xs lg:text-sm font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Paper Trading
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderPT;
