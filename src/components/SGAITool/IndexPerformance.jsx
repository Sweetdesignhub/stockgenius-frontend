import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const IndexPerformance = ({ data }) => {
  const {
    start_date,
    end_date,
    start_open,
    start_close,
    end_open,
    end_close,
    nifty100_return,
    currency = "Rs",
  } = data;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  console.log("Index performance: ", data);
  const headerColor = theme === "dark" ? "text-white" : "text-black";
  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const cardBaseClass = `
    relative border border-transparent
    bg-clip-border backdrop-blur-[18px]
    rounded-lg py-2 px-4 font-medium shadow-lg
  `;

  const fancyRedCardClass = `
    ${cardBaseClass}
    bg-gradient-to-b from-[#FF1E1E] to-[#8B0000]
    shadow-[0px_8.97px_26.92px_0px_#FF1E1EB2_inset,_0px_8.97px_35.9px_0px_#8B000080]
    text-white
  `.trim();

  const fancyGreenCardClass = `
    ${cardBaseClass}
    bg-gradient-to-b from-[#00FF7F] to-[#006400]
    shadow-[0px_8.97px_26.92px_0px_#00FF7FB2_inset,_0px_8.97px_35.9px_0px_#00640080]
    text-white
  `.trim();

  const fancyPurpleCardClass = `
    ${cardBaseClass}
    bg-gradient-to-b from-[#C084FC] to-[#9333EA]
    shadow-[0px_8.97px_26.92px_0px_#C084FCB2_inset,_0px_8.97px_35.9px_0px_#9333EA80]
    text-white
  `.trim();

  const getValueCardClass = (open, close) =>
    close >= open ? fancyGreenCardClass : fancyRedCardClass;
  const isNiftyReturnNegative = nifty100_return < 0;

  return (
    <div
      className={`max-w-3xl h-full mx-auto p-6 rounded-3xl  shadow-2xl backdrop-blur-md ${
        theme === "dark" ? "bg-white/1" : "bg-white/1"
      }`}
    >
      <h2 className={`text-2xl font-bold mb-3  ${headerColor}`}>
        Index Performance
      </h2>
      <div
        className={`h-px w-full mb-6 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>

      <div className="space-y-8">
        {/* Start Date */}
        <div>
          <p className={`text-lg mb-3 ${textColor}`}>
            Start Date - {start_date}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className={fancyPurpleCardClass}>
              Open - {start_open.toFixed(2)} {currency}
            </div>
            <div className={getValueCardClass(start_open, start_close)}>
              Close - {start_close.toFixed(2)} {currency}
            </div>
          </div>
        </div>

        {/* End Date */}
        <div>
          <p className={`text-lg mb-3 ${textColor}`}>End Date - {end_date}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className={fancyPurpleCardClass}>
              Open - {end_open.toFixed(2)} {currency}
            </div>
            <div className={getValueCardClass(end_open, end_close)}>
              Close - {end_close.toFixed(2)} {currency}
            </div>
          </div>
        </div>

        {/* Nifty Return */}
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <p className={`text-xl ${textColor}`}>Nifty 100 Return -</p>
            <div className="flex items-center ml-2">
              <p
                className={`text-3xl font-bold ${
                  isNiftyReturnNegative ? "text-red-500" : "text-green-500"
                }`}
              >
                {nifty100_return.toFixed(2)}%
              </p>
              <div
                className={`ml-2 p-2 rounded-full ${
                  isNiftyReturnNegative ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {isNiftyReturnNegative ? (
                  <FiArrowDown className="text-white" size={24} />
                ) : (
                  <FiArrowUp className="text-white" size={24} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPerformance;
