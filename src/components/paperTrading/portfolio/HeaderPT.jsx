import { Link } from "react-router-dom";

function HeaderPT() {
  return (
    <div className="flex justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold">Account Manager</h1>
      <div className="flex gap-3">
        <div className="relative group">
          <Link to={"/india/paper-trading/auto-trade"}>
            <div className="bg-white rounded-2xl px-4 py-1 cursor-pointer">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd8fe962448c0436eb22de11f97927855"
                alt="Auto Trade"
              />
            </div>
          </Link>
          <span className="absolute bottom-10 left-[-25px] right-0 text-center font-semibold dark:text-white  opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Auto TradeBot
          </span>
        </div>
        <div className="relative group">
          <Link to={"/india/paper-trading"}>
            <div className="bg-[#3A6FF8] rounded-2xl px-4 py-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775"
                alt="Paper Trading"
              />
            </div>
          </Link>
          <span className="absolute bottom-11 left-[-25px] right-0 text-center font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Paper Trading
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderPT;