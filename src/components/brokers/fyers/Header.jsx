// src/components/header/Header.jsx
import React, { useEffect, useState } from "react";

function Header() {
  const [selectedOption, setSelectedOption] = useState("Fyers");

  return (
    <div className="flex justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold">Account Manager</h1>
      <div className="flex items-center">
        <div className="max-h-10">
          {selectedOption === "Fyers" && (
            <div className="flex items-center">
              <img
                className="h-16"
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb0f59404dbfe4720b7475114d61a6db6"
                alt="Fyers"
              />
            </div>
          )}
          {selectedOption === "Zerodha" && (
            <img
              className="h-8"
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd314830a17a84ee5956be4ca2cee3c5a"
              alt="Zerodha"
            />
          )}
          {selectedOption === "Motilal Oswal" && (
            <img
              className="h-10"
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fe9a3e857c17e41ceac69d3e2acc20695"
              alt="Motilal Oswal"
            />
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Header;
