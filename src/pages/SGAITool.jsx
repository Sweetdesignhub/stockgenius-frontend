import { useState, useEffect } from "react";
import SmartTradeBlueprint from "../components/SGAITool/SmartTradeBlueprint";
import { useTheme } from "../contexts/ThemeContext";

function SGAITool() {
  const { theme, updateTheme } = useTheme();
  useEffect(() => {
    if (theme === "system") {
      // console.log("Theme updatedD");
      updateTheme("dark");
    }
  }, [theme, updateTheme]);
  return (
    <div className="min-h-fit lg:px-12 p-4 relative page-scrollbar">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="Bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="Bear"
        />

      {/* Center Content */}
      <div className="flex-1 flex justify-center items-centerz">
        <SmartTradeBlueprint />
      </div>

      
    </div>

    // <div className=" flex items-center justify-center">
    //   <img
    //     loading="lazy"
    //     className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
    //     src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
    //     alt="bull"
    //   />
    //   <div className="h-full bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
    //     <SmartTradeBlueprint />{" "}
    //   </div>
    //   <img
    //     loading="lazy"
    //     className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
    //     src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
    //     alt="bear"
    //   />
    // </div>
  );
}

export default SGAITool;
