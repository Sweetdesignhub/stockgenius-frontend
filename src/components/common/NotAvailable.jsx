import React from "react";

const NotAvailable = ({ dynamicText }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <div className="flex flex-col md:items-start items-center mb-4 md:mb-0">
        <span className="text-3xl md:text-4xl font-bold mb-2">
          {dynamicText}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F86858af14e164e91a3cc4fdac4da3ed0"
          alt="Person with laptop"
          className="w-32 h-32 md:w-48 md:h-48"
        />
      </div>
    </div>
  );
};

export default NotAvailable;
