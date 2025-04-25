"use client";

import { FiRefreshCw, FiPrinter, FiSettings } from "react-icons/fi";

const Header = ({ onReRun }) => {
  return (
    <div className="flex justify-between font-poppins items-center">
      <div>
        <h1 className="text-xl font-poppins font-bold">SmartTrade Blueprint</h1>
        <p className="text-sm text-gray-400">
          See What Could've Been - Simulate, Learn & Plan Smarter
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onReRun}
          className="flex items-center px-4 py-2 text-orange-500 border rounded-full bg-white text-extrabold transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Re-Run
        </button>

        <button className="flex items-center px-4 py-2 bg-white text-blue-500 border rounded-full text-extrabold hover:bg-gray-100 transition-colors">
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
