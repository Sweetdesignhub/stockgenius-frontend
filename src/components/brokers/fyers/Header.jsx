// src/components/header/Header.jsx
import { useEffect, useState } from "react";

function Header() {
  const [selectedOption, setSelectedOption] = useState("Fyers");

  return (    <div className="grid grid-cols-[1fr,auto,1fr] sm:flex sm:justify-between items-center pb-2 border-b w-full max-w-full overflow-x-hidden">
      <h1 className="font-[poppins] font-semibold whitespace-nowrap">Account Manager</h1>
      <div className="flex items-center justify-end sm:ml-auto shrink-0">
        <div className="shrink-0">
          {selectedOption === "Fyers" && (            <div className="flex items-center">
              <img
                className="h-12 sm:h-16"
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
