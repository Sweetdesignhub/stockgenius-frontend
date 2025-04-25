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
    relative border border-transparent
    bg-gradient-to-b from-[#FF1E1E] to-[#8B0000]
    bg-clip-border backdrop-blur-[18px]
    shadow-[0px_8.97px_26.92px_0px_#FF1E1EB2_inset]
    shadow-[0px_8.97px_35.9px_0px_#8B000080]
    rounded-lg py-2 px-4
  `.trim();

  const fancyGreenCardClass = `
    relative border border-transparent
    bg-gradient-to-b from-[#00FF7F] to-[#006400]
    bg-clip-border backdrop-blur-[18px]
    shadow-[0px_8.97px_26.92px_0px_#00FF7FB2_inset]
    shadow-[0px_8.97px_35.9px_0px_#00640080]
    rounded-lg py-2 px-4
  `.trim();

  const fancyYellowCardClass = `
    relative border border-transparent
    bg-gradient-to-b from-[#F9D423] to-[#FFB347]
    bg-clip-border backdrop-blur-[18px]
    shadow-[0px_8.97px_26.92px_0px_#F9D423B2_inset]
    shadow-[0px_8.97px_35.9px_0px_#FFB34780]
    rounded-lg py-2 px-4
  `.trim();

  const gradientClass =
    final_value < initial_cash ? fancyRedCardClass : fancyGreenCardClass;

  return (
    <div
      className={`max-w-3xl h-full mx-auto p-6 rounded-3xl  shadow-2xl backdrop-blur-md
        ${isDark ? "bg-white/1  text-white" : "bg-white text-gray-900 "}
      `}
    >
      <h2 className="text-2xl font-bold mb-3">NSE Simulation Results</h2>

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
