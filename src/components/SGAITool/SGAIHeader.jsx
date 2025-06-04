"use client";

import { FiRefreshCw, FiPrinter, FiSettings } from "react-icons/fi";

const Header = ({ onReRun, isLoading }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-2 md:items-center font-poppins">
      {/* Title Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
          SmartTrade Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md">
          See What Could've Been – Simulate, Learn & Plan Smarter
        </p>
      </div>

      {/* Button Section */}
      <div className="flex justify-center md:justify-start gap-3 w-full md:w-auto">
        {isLoading ? (
          <div className="flex items-center px-4 text-orange-500 border rounded-full bg-white font-semibold">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
            <span>Loading</span>
          </div>
        ) : (
          <button
            onClick={onReRun}
            className="flex items-center px-4 h-[38px] text-orange-500 border rounded-2xl bg-white font-semibold transition-colors shadow-[0px_22.87px_48.6px_0px_#FF6A0030]"
          >
            <FiRefreshCw className="mr-2" />
            Re-Run
          </button>
        )}

        <button
          className="flex items-center px-4 h-[38px] bg-white text-blue-500 border rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-[0px_22.87px_48.6px_0px_#3A6FF830] cursor-not-allowed"
          disabled
        >
          <FiPrinter className="mr-2" />
          Print
        </button>
      </div>
    </div>
  );
};

export default Header;

const HeaderLoading = () => (
  <div className="flex justify-center h-2 items-center px-6 py-3 ">
    <div className="animate-spin rounded-full h-2 w-2 border-b-2 dark:border-white border-gray-900"></div>
    <h1 className="mx-2">Loading</h1>
  </div>
);
