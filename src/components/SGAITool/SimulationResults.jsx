import { useTheme } from "../../contexts/ThemeContext";

const SimulationResults = ({ title = "NSE", data, currency = "" }) => {
  const {
    initial_cash,
    final_value,
    realized_pnl,
    unrealized_pnl,
    returns,
    total_pnl,
  } = data;

  // console.log("daat is recieved", data);

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const fancyRedCardClass = `
    relative
    text-white
    border-[0.9px] border-transparent
    rounded-lg py-1 px-2
    text-[clamp(0.8rem,0.8rem,2rem)]
    
    backdrop-blur-[17.95px]
    ${
      isDark
        ? "shadow-[inset_0px_8.97px_26.92px_0px_#FF496AB2,0px_8.97px_35.9px_0px_#AF3F5380] [border-image:linear-gradient(180deg,rgba(136,39,45,0.4)_17.19%,rgba(251,98,107,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(136,39,45,0)_-4.69%,rgba(254,189,189,0.3)_100%)] [border-image-slice:1] [background:linear-gradient(180deg,rgba(0,0,0,0)_-40.91%,#88272D_132.95%)]"
        : "bg-[#FF0000E5]"
    }
    overflow-hidden
`.trim();

  const fancyGreenCardClass = `
    relative
    text-white
    border-[0.9px] border-transparent
    rounded-lg py-1 px-2
    text-[clamp(0.8rem,0.8rem,2rem)]
    backdrop-blur-[18px]
    overflow-hidden
    ${
      isDark
        ? "shadow-[inset_0px_8.97px_26.92px_0px_#00FF7FB2,0px_8.97px_35.9px_0px_#00640080] [border-image:linear-gradient(180deg,rgba(0,100,0,0.4)_17.19%,rgba(0,255,127,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(0,100,0,0)_-4.69%,rgba(144,238,144,0.3)_100%)] [border-image-slice:1]"
        : "bg-[#FF0000E5]"
    }
`.trim();
  const fancyYellowCardClass = `
    relative
    text-white
    border-[0.9px] border-transparent
    rounded-lg py-1 px-2
    text-[clamp(0.8rem,0.8rem,2rem)]
    overflow-hidden
     ${
       isDark
         ? "shadow-[inset_0px_8.97px_26.92px_0px_#FFE449B2,0px_8.97px_35.9px_0px_#5C500B80] [background:linear-gradient(180deg,rgba(0,0,0,0)_-40.91%,#5C500B_132.95%)] [border-image:linear-gradient(180deg,rgba(92,73,11,0.4)_17.19%,rgba(251,228,98,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(92,76,11,0)_-4.69%,rgba(254,252,189,0.3)_100%)] [border-image-slice:1]"
         : "bg-[#F0A709]"
     }
    
    backdrop-blur-[17.95px]
`.trim();

  const gradientClass =
    final_value < initial_cash ? fancyRedCardClass : fancyGreenCardClass;

  return (
    <div
      className={`max-w-3xl h-full mx-auto py-5 px-3 rounded-xl backdrop-blur-md
        ${isDark ? "bg-white/1  text-white" : "bg-white "}
      `}
    >
      <h2 className="text-[clamp(1.2rem,1.2rem,2rem)] font-bold mb-3">
        {title} Simulation Results
      </h2>

      <div
        className={`h-px w-full mb-6 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Initial Cash
          </p>
          <div className={`${fancyYellowCardClass}`}>
            {currency + initial_cash.toFixed(2)}
          </div>
        </div>

        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Final Value
          </p>
          <div className={`${gradientClass} `}>
            {currency + final_value.toFixed(2)}
          </div>
        </div>

        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Realized PnL
          </p>
          <div className={`${gradientClass} `}>
            {currency + realized_pnl.toFixed(2)}
          </div>
        </div>

        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Unrealized PnL
          </p>
          <div className={`${gradientClass} `}>
            {currency + unrealized_pnl.toFixed(2)}
          </div>
        </div>

        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Total Return
          </p>
          <div className={`${gradientClass} `}>{returns.toFixed(2)}%</div>
        </div>

        <div>
          <p
            className={`text-[clamp(0.8rem,0.9rem,2rem)] mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Total PnL
          </p>
          <div className={`${gradientClass}`}>
            {currency + total_pnl.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
