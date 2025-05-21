"use client";

import { FiRefreshCw, FiPrinter, FiSettings } from "react-icons/fi";

const Header = ({ onReRun, isLoading }) => {
  return (
    <div className="flex justify-between font-poppins items-center">
      <div>
        <h1 className="text-xl font-poppins font-bold">SmartTrade Blueprint</h1>
        <p className="text-sm text-gray-400">
          See What Could've Been - Simulate, Learn & Plan Smarter
        </p>
      </div>

      <div className="flex space-x-2">
        {isLoading ? (
          <div className="flex items-center px-4  text-orange-500 border rounded-full bg-white text-extrabold transition-colors">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
            <span>Loading</span>
          </div>
        ) : (
          <button
            onClick={onReRun}
            className="flex items-center px-4 h-[38px] text-orange-500 border rounded-2xl bg-white text-extrabold transition-colors shadow-[0px_22.87px_48.6px_0px_#FF6A0030]"
          >
            <FiRefreshCw className="mr-2" />
            Re-Run
          </button>
        )}

        <button
          className="flex items-center px-4 py-2 h-[38px] bg-white text-blue-500 border rounded-2xl text-extrabold hover:bg-gray-100 transition-colors cursor-not-allowed shadow-[0px_22.87px_48.6px_0px_#3A6FF830]"
          disabled
        >
          <FiPrinter className="mr-2" />
          Print
        </button>

        {/* <button className="flex items-center px-4 py-2 bg-white text-red-400 border rounded-full text-extrabold hover:bg-gray-100 transition-colors">
          <FiSettings className="mr-2" />
          Settings
        </button> */}
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
