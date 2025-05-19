import { useState } from "react";
import SmartTradeBlueprint from "../components/SGAITool/SmartTradeBlueprint";
// import { useTheme}

function SGAITool() {
  // Dummy data for SimulationResults
  const [simulationData] = useState({
    initialCash: 5000.0,
    finalValue: 4028.45,
    realizedPnL: 840.13,
    unrealizedPnL: 48.61,
    totalReturn: 15.83,
    totalProfitLoss: 791.52,
    currency: "Rs",
  });

  // Dummy data for IndexPerformance
  const [indexData] = useState({
    startDate: "2024-11-12",
    endDate: "2024-11-12",
    startOpen: 25094.35,
    startClose: 24715.55,
    endOpen: 23712.5,
    endClose: 23902.1,
    niftyReturn: -3.29,
    currency: "Rs",
  });
  return (
    <div className="relative w-full flex items-center justify-between overflow-hidden">
      {/* Left Image */}
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0 w-[165px]"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
        alt="bull"
      />

      {/* Center Content */}
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="h-full w-full mx-36 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4">
          <SmartTradeBlueprint />
        </div>
      </div>

      {/* Right Image */}
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0 w-[160px]"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
        alt="bear"
      />
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
