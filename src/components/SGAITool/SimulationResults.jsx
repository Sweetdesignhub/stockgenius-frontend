import { useTheme } from "../../contexts/ThemeContext";

const SimulationResults = ({ data }) => {
  const {
    initial_cash,
    final_value,
    realized_pnl,
    unrealized_pnl,
    total_return,
    total_profit_loss,
    currency = "Rs",
  } = data;

  console.log("daat is recieved", data);

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const fancyRedCardClass = `
  relative
  border-[0.9px] border-transparent
  text-[#FFD7D7]
  rounded-lg py-1 px-2
  shadow-[inset_0px_8.97px_26.92px_0px_#FF496AB2,0px_8.97px_35.9px_0px_#AF3F5380]
  backdrop-blur-[17.95px]
  overflow-hidden
  [border-image:linear-gradient(180deg,rgba(136,39,45,0.4)_17.19%,rgba(251,98,107,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(136,39,45,0)_-4.69%,rgba(254,189,189,0.3)_100%)]
  [border-image-slice:1]
  [background:linear-gradient(180deg,rgba(0,0,0,0)_-40.91%,#88272D_132.95%)]
`.trim();

  const fancyGreenCardClass = `
    relative
    text-[#FFD7D7]
    border-[0.9px] border-transparent
    text-white
    rounded-lg py-1 px-2
    shadow-[inset_0px_8.97px_26.92px_0px_#00FF7FB2,0px_8.97px_35.9px_0px_#00640080]
    backdrop-blur-[18px]
    overflow-hidden
    [border-image:linear-gradient(180deg,rgba(0,100,0,0.4)_17.19%,rgba(0,255,127,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(0,100,0,0)_-4.69%,rgba(144,238,144,0.3)_100%)]
    [border-image-slice:1]
`.trim();
  const fancyYellowCardClass = `
    relative
    text-[#FFD7D7]
    border-[0.9px] border-transparent
    rounded-lg py-1 px-2
    overflow-hidden
    [background:linear-gradient(180deg,rgba(0,0,0,0)_-40.91%,#5C500B_132.95%)]
    [border-image:linear-gradient(180deg,rgba(92,73,11,0.4)_17.19%,rgba(251,228,98,0.77)_100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(180deg,rgba(92,76,11,0)_-4.69%,rgba(254,252,189,0.3)_100%)]
    [border-image-slice:1]
    shadow-[inset_0px_8.97px_26.92px_0px_#FFE449B2,0px_8.97px_35.9px_0px_#5C500B80]
    backdrop-blur-[17.95px]
`.trim();

  const gradientClass =
    final_value < initial_cash ? fancyRedCardClass : fancyGreenCardClass;

  return (
    <div
      className={`max-w-3xl h-full mx-auto p-6 rounded-3xl  shadow-2xl backdrop-blur-md
        ${isDark ? "bg-white/1  text-white" : "bg-white/50 text-gray-900 "}
      `}
    >
      <h2 className="text-base md:text-xl font-bold mb-3">
        NSE Simulation Results
      </h2>

      <div
        className={`h-px w-full mb-6 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Initial Cash
          </p>
          <div
            className={`${fancyYellowCardClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {initial_cash.toFixed(2)} {currency}
          </div>
        </div>

        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Final Value
          </p>
          <div
            className={`${gradientClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {final_value.toFixed(2)} {currency}
          </div>
        </div>

        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Realized PnL
          </p>
          <div
            className={`${gradientClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {realized_pnl.toFixed(2)} {currency}
          </div>
        </div>

        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Unrealized PnL
          </p>
          <div
            className={`${gradientClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {unrealized_pnl.toFixed(2)} {currency}
          </div>
        </div>

        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Total Return
          </p>
          <div
            className={`${gradientClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {total_return.toFixed(2)}%
          </div>
        </div>

        <div>
          <p
            className={`text-base mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Total Profit/Loss
          </p>
          <div
            className={`${gradientClass} p-3 rounded-xl text-white font-medium shadow-lg`}
          >
            {total_profit_loss.toFixed(2)} {currency}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;

const FancyRedCard = ({ children }) => {
  return (
    <div
      className={`
        relative
        border-[0.9px] border-transparent
        text-[#FFD7D7]
        rounded-lg py-2 px-4
        shadow-[inset_0px_8.97px_26.92px_0px_#FF496AB2,0px_8.97px_35.9px_0px_#AF3F5380]
        backdrop-blur-[17.95px]
        overflow-hidden
      `}
      style={{
        borderImage: `
          linear-gradient(180deg, rgba(136, 39, 45, 0.4) 17.19%, rgba(251, 98, 107, 0.77) 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(180deg, rgba(136, 39, 45, 0) -4.69%, rgba(254, 189, 189, 0.3) 100%)
        `,
        borderImageSlice: 1,
        background: `
          linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #88272D 132.95%)
        `,
      }}
    >
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-red-900/50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
