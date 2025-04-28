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

  const fancyPurpleCardClass = `
    relative
    text-[#FFD7FF]
    border-[0.9px] border-transparent
    rounded-lg py-1 px-2
    overflow-hidden
    [background:linear-gradient(180deg,rgba(0,0,0,0)_-40.91%,#882776_132.95%)]
    [border-image:linear-gradient(180deg,rgba(136,39,118,0.4)_17.19%,rgba(251,98,241,0.77)_100%),
    linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),
    linear-gradient(180deg,rgba(136,39,118,0)_-4.69%,rgba(254,189,253,0.3)_100%)]
    [border-image-slice:1]
    shadow-[inset_0px_8.97px_26.92px_0px_#FF49F3B2,0px_8.97px_35.9px_0px_#AF3FA080]
    backdrop-blur-[17.95px]
  `.trim();

  const getValueCardClass = (open, close) =>
    close >= open ? fancyGreenCardClass : fancyRedCardClass;
  const isNiftyReturnNegative = nifty100_return < 0;

  return (
    <div
      className={`max-w-3xl h-full mx-auto p-6 rounded-3xl  shadow-2xl backdrop-blur-md ${
        theme === "dark" ? "bg-white/1" : "bg-white/50"
      }`}
    >
      <h2 className={`text-base md:text-xl font-bold mb-3  ${headerColor}`}>
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

function CurrencyDisplay() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800">
      <div className="px-6 py-3 text-xl font-medium text-white rounded-full bg-gradient-to-r from-red-900/90 to-red-800/90 shadow-lg shadow-red-900/30 border border-red-700/30">
        4028.45 Rs
      </div>
    </div>
  );
}
