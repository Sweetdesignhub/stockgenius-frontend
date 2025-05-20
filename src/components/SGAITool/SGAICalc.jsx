import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { FiCalendar, FiMinus, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import Loading from "../common/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const SGAICalc = ({ onSimulationComplete, onStatusUpdate }) => {
  const region = useSelector((state) => state.region); // Get region from store
  const market = useSelector((state) => state.market); // Get region from store
  console.log("Region is: ", market);
  const [showDateErrorModal, setShowDateErrorModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const [marketTitle, setMarketTitle] = useState("NYSE");
  const [currency, setCurrency] = useState("₹");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgClass =
    theme === "dark"
      ? "text-white border border-[0.73px]  border-white/10 shadow-lg shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.4)]  bg-gradient-to-t from-white/1  to-transparent"
      : "text-gray-800 ring-1 ring-white/30 bg-white ";

  useEffect(() => {
    if (region === "india") {
      setCurrency("₹");
      setMarketTitle("NSE");
    } else {
      if (market === "NYSE") {
        setMarketTitle("NYSE");
      } else {
        setMarketTitle("NASDAQ");
      }
      setCurrency("$");
    }
  }, [region]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      initialCash: "10000",
      startDate: "2025/04/01",
      endDate: "2025/04/02",
      marginProfit: "05.00",
      marginLoss: "02.00",
    },
  });

  const handleClear = () => {
    reset({
      initialCash: "",
      startDate: "",
      endDate: "",
      marginProfit: "",
      marginLoss: "",
    });

    // Clear simulation results in parent component
    if (onSimulationComplete) {
      onSimulationComplete(null); // or onSimulationComplete({})
    }
  };
  const formatDate = (date) => {
    console.log("Format Date: ", date);

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    // const [year, month, day] = date.split("/"); // Split the date by '/'
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("(Calc Onsubmit)Region", region);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start > end) {
      setShowDateErrorModal(true);
      setIsLoading(false);
      return;
    }

    console.log("(Calc Onsubmit)Data inout ois", data);
    if (region === "india") {
      try {
        // http://20.29.48.73:8000/simulate
        // http://20.244.43.100:8000/simulate INDIA(WORKING)
        const response = await axios.post(
          "https://nsereports.stockgenius.ai/simulate",
          {
            initial_cash: parseFloat(data.initialCash),
            start_date: formatDate(data.startDate),
            end_date: formatDate(data.endDate),
            profit_margin: parseFloat(data.marginProfit).toFixed(2),
            loss_margin: parseFloat(data.marginLoss).toFixed(2),
          },
          {
            timeout: 600000, // 10 minutes
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("(Calc)response: ", response.data);
        // if (!response.ok) {
        //   throw new Error("API request failed");
        // }
        const result = response.data;
        // const result = await response.data.json();
        console.log("result is: ", result);
        if (onSimulationComplete) {
          onSimulationComplete({
            formValues: {
              ...data,
              currency,
              marketTitle,
            },
            results: {
              ...result,
              currency,
              marketTitle,
            },
          });
        }
      } catch (error) {
        console.error("Simulation error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          "https://nasdaqnysereports.stockgenius.ai/simulate",
          {
            initial_cash: parseFloat(data.initialCash),
            start_date: formatDate(data.startDate),
            end_date: formatDate(data.endDate),
            profit_margin: parseFloat(data.marginProfit).toFixed(2),
            loss_margin: parseFloat(data.marginLoss).toFixed(2),
          },
          {
            timeout: 600000, // 10 minutes in milliseconds
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // if (!response.ok) {
        //   throw new Error("API request failed");
        // }
        const result = response.data;
        // const result = await response.json();
        console.log("result is: ", result);
        if (onSimulationComplete) {
          onSimulationComplete({
            formValues: {
              ...data,
              currency,
              marketTitle,
            },
            results: {
              ...result,
              currency,
              marketTitle,
            },
          });
        }
      } catch (error) {
        console.error("Simulation error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const incrementValue = (field, value, step = 1) => {
    const numValue = Number.parseFloat(value) || 0;
    return field === "initialCash"
      ? String(numValue + step * 100)
      : (numValue + step).toFixed(2).padStart(5, "0");
  };

  const decrementValue = (field, value, step = 1) => {
    const numValue = Number.parseFloat(value) || 0;
    const newValue =
      field === "initialCash" ? numValue - step * 100 : numValue - step;
    return field === "initialCash"
      ? String(Math.max(0, newValue))
      : Math.max(0, newValue).toFixed(2).padStart(5, "0");
  };

  // Render loading component if data is still loading
  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div
      className={`mx-auto py-4 px-6 rounded-xl flex flex-col justify-around items-start w-full inset-0 h-full
      backdrop-blur-[1px]
      mask-[linear-gradient(to_bottom,white_20%,transparent_80%)] ${bgClass} `}
    >
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex-1">
          <h1 className="text-[clamp(1.2rem,1.2rem,2rem)] font-bold">
            SGAI - Investment Simulation Tool
          </h1>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-1 bg-white text-red-500 rounded-xl font-medium hover:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        className={`h-px w-full mb-2 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>
      {/* <div className={` w-full${isDark ? "bg-white/20" : "bg-gray-300"}`}></div> */}
      <form onSubmit={handleSubmit(onSubmit)} className=" w-full">
        <div className="h-full">
          {/* Initial Cash */}
          <div className="">
            <div className="flex justify-between items-center w-full mb-2">
              <label className="text-base">Initial Cash</label>
              <RadioGroup value={currency} onChange={() => {}} className="flex">
                <RadioGroup.Option value="₹" disabled>
                  {({ checked }) => (
                    <span
                      className={`w-6 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        checked
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-300 text-black"
                      } opacity-50 cursor-not-allowed`}
                    >
                      ₹
                    </span>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option value="$" className="ml-2" disabled>
                  {({ checked }) => (
                    <span
                      className={`w-6 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        checked
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-300 text-black"
                      } opacity-100 cursor-not-allowed`}
                    >
                      $
                    </span>
                  )}
                </RadioGroup.Option>
              </RadioGroup>
            </div>
            <div className="relative">
              <Controller
                name="initialCash"
                control={control}
                rules={{
                  required: "Initial cash is required",
                  validate: {
                    positive: (value) =>
                      parseFloat(value) >= 0 ||
                      "Amount must be greater than or Equal to 0",
                    validNumber: (value) =>
                      !isNaN(parseFloat(value)) ||
                      "Please enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <input
                      {...field}
                      type="text"
                      className="w-full  px-3 py-1 border border-gray-300 rounded-lg text-black text-base"
                      placeholder="Enter initial cash"
                    />
                    <button
                      type="button"
                      className="absolute right-12 text-gray-500"
                      onClick={() =>
                        field.onChange(
                          decrementValue("initialCash", field.value)
                        )
                      }
                    >
                      <FiMinus size={20} />
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 text-gray-500"
                      onClick={() =>
                        field.onChange(
                          incrementValue("initialCash", field.value)
                        )
                      }
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                )}
              />
            </div>
            {errors.initialCash && (
              <p className="mt-1 text-red-400">{errors.initialCash.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-medium mb-2">Start Date</label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="YYYY/MM/DD"
                      dateFormat="yyyy/MM/dd"
                      className="w-full px-2 py-1 rounded-lg text-black text-base border border-gray-300  focus:ring-blue-500 focus:border-transparent"
                      popperClassName="!z-50" // Ensures the modal appears above other elements
                      wrapperClassName="w-full"
                      renderCustomHeader={({
                        monthDate,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div className="flex items-center justify-between px-2 text-sm bg-gray-100 rounded-t-lg">
                          <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <span className="font-semibold text-gray-800">
                            {monthDate.toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      )}
                    />
                    <FiCalendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                )}
              />
              {errors.startDate && (
                <p className="text-xs text-red-400">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-base mb-2">End Date</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <div className="relative">
                    {/* <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="YYYY/MM/DD"
                      dateFormat="yyyy/MM/dd"
                      className="w-full px-2 py-1 rounded-lg  bg-[#DDDDDD] text-black text-base border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    /> */}
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="YYYY/MM/DD"
                      dateFormat="yyyy/MM/dd"
                      className="w-full px-2 py-1 rounded-lg border border-gray-300   text-black text-base focus:ring-blue-500 focus:border-transparent"
                      popperClassName="!z-50" // Ensures the modal appears above other elements
                      wrapperClassName="w-full"
                      renderCustomHeader={({
                        monthDate,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div className="flex items-center justify-between px-2 text-sm bg-gray-100 rounded-t-lg">
                          <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <span className="font-semibold text-gray-800">
                            {monthDate.toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      )}
                    />
                    {/* <DayPicker
                      animate
                      mode="single"
                      // onChange={(date) => field.onChange(date)}
                      selectedDate={field.value}
                      onSelect={setSelectedDate}
                      footer={
                        selectedDate
                          ? `Selected: ${selectedDate.toLocaleDateString()}`
                          : "Pick a day."
                      }
                    /> */}
                    <FiCalendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                )}
              />
              {errors.endDate && (
                <p className="mt-1 text-red-400">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Margin Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Margin Profit */}
            <div>
              {!errors.marginProfit && (
                <label className="block text-base mb-2">
                  Margin Profit (%)
                </label>
              )}
              {errors.marginProfit && (
                <p className="block text-base mb-2 text-red-400">
                  {errors.marginProfit.message}
                </p>
              )}
              <div className="relative ">
                <Controller
                  name="marginProfit"
                  control={control}
                  rules={{
                    required: "Margin Profit is required",
                    validate: {
                      positive: (value) =>
                        parseFloat(value) >= 0 ||
                        "Margin Profit must be greater than or Equal to 0",
                      validNumber: (value) =>
                        !isNaN(parseFloat(value)) ||
                        "Please enter a valid number",
                    },
                  }}
                  render={({ field }) => (
                    <div className="flex items-center ">
                      <input
                        {...field}
                        type="text"
                        className="w-full border border-gray-300  px-3 py-1 rounded-lg  text-black text-base"
                        placeholder="00.00"
                      />
                      <button
                        type="button"
                        className="absolute right-12 text-gray-500"
                        onClick={() =>
                          field.onChange(
                            decrementValue("marginProfit", field.value, 0.1)
                          )
                        }
                      >
                        <FiMinus size={20} />
                      </button>
                      <button
                        type="button"
                        className="absolute right-2 text-gray-500"
                        onClick={() =>
                          field.onChange(
                            incrementValue("marginProfit", field.value, 0.1)
                          )
                        }
                      >
                        <FiPlus size={20} />
                      </button>
                    </div>
                  )}
                />
              </div>
              {/* {errors.marginProfit && (
                <p className="mt-1 text-red-400">
                  {errors.marginProfit.message}
                </p>
              )} */}
            </div>

            {/* Margin Loss */}
            <div>
              {!errors.marginLoss && (
                <label className="block text-base mb-2">Margin Loss (%)</label>
              )}
              {errors.marginLoss && (
                <p className="block text-base mb-2 text-red-400">
                  {errors.marginLoss.message}
                </p>
              )}
              <div className="relative">
                <Controller
                  name="marginLoss"
                  control={control}
                  rules={{
                    required: "Margin loss is required",
                    min: {
                      value: 2.0,
                      message: "Margin loss must be at least 2.00",
                    },
                  }}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <input
                        {...field}
                        type="text"
                        step="0.1"
                        className="w-full px-3 py-1 rounded-lg border border-gray-300  text-black text-base"
                        placeholder="00.00"
                      />
                      <button
                        type="button"
                        className="absolute right-12 text-gray-500"
                        onClick={() =>
                          field.onChange(
                            decrementValue("marginLoss", field.value, 0.1)
                          )
                        }
                      >
                        <FiMinus size={20} />
                      </button>
                      <button
                        type="button"
                        className="absolute right-2 text-gray-500"
                        onClick={() =>
                          field.onChange(
                            incrementValue("marginLoss", field.value, 0.1)
                          )
                        }
                      >
                        <FiPlus size={20} />
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-1 mt-2 bg-[#3A6FF8] rounded-xl text-white font-medium text-base hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <CalcLoading className="h-1" /> : "Run Simulation"}
            </button>
          </div>
        </div>
      </form>
      {showDateErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Invalid Date Range
            </h2>
            <p className="text-gray-700 mb-4">
              Start date must be earlier than or equal to end date.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => setShowDateErrorModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SGAICalc;

const CalcLoading = () => (
  <div className="flex justify-center text-white h-3 items-center px-6 py-3 ">
    <div
      className={`animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 `}
    ></div>
    <h1 className="mx-2">Loading</h1>
  </div>
);
