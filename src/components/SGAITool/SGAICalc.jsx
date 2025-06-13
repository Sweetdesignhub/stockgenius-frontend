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
import api from "../../config";
import PricingDialog from "../pricing/PricingDialog";

const SGAICalc = ({ onSimulationComplete, onStatusUpdate }) => {
  const region = useSelector((state) => state.region); // Get region from store
  const market = useSelector((state) => state.market); // Get region from store
  // console.log("Region is: ", market);
  const [showDateErrorModal, setShowDateErrorModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const [marketTitle, setMarketTitle] = useState("NYSE");
  const [currency, setCurrency] = useState("₹");
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);

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
    // console.log("Format Date: ", date);

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    // const [year, month, day] = date.split("/"); // Split the date by '/'
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    // console.log("(Calc Onsubmit)Region", region);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start > end) {
      setShowDateErrorModal(true);
      setIsLoading(false);
      return;
    }

    // console.log("(Calc Onsubmit)Data inout ois", data);
    if (region === "india") {
      try {
        const NseResponse = await api.post(`/api/v1/simulation/nse`, {
          initial_cash: parseFloat(data.initialCash),
          start_date: formatDate(data.startDate),
          end_date: formatDate(data.endDate),
          profit_margin: parseFloat(data.marginProfit).toFixed(2),
          loss_margin: parseFloat(data.marginLoss).toFixed(2),
        });

        console.log("NSE Response: ", NseResponse.data);

        const result = NseResponse.data;

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
        if (error.response && error.response.status === 403) {
          setIsPricingDialogOpen(true);
          // alert("Simulation limit reached for this month.");
        } else {
          console.error("Simulation error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const NasdaqResponse = await api.post(`/api/v1/simulation/nasdaq`, {
          initial_cash: parseFloat(data.initialCash),
          start_date: formatDate(data.startDate),
          end_date: formatDate(data.endDate),
          profit_margin: parseFloat(data.marginProfit).toFixed(2),
          loss_margin: parseFloat(data.marginLoss).toFixed(2),
        });

        console.log("Nasdaq Response: ", NasdaqResponse.data);

        const result = NasdaqResponse.data;

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
        if (error.response && error.response.status === 403) {
          setIsPricingDialogOpen(true);
          // alert("Simulation limit reached for this month.");
        } else {
          console.error("Simulation error:", error);
        }
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
      className={`mx-auto w-full max-w-screen-xl px-3 sm:px-4 py-2 rounded-xl 
              flex flex-col justify-around items-start 
              h-full inset-0 
              backdrop-blur-[1px] 
              mask-[linear-gradient(to_bottom,white_20%,transparent_80%)] 
              ${bgClass}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 mb-2">
        <div className="flex-1">
          {" "}
          <h1 className="text-[clamp(0.9rem,0.9vw,1.6rem)] font-bold leading-tight">
            SGAI - Investment Simulation Tool
          </h1>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="px-2 py-0.5 bg-white text-red-500 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap text-xs"
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
            {" "}
            <div className="flex justify-between items-center w-full mb-2">
              <label className="text-sm">Initial Cash</label>
              <span
                className={`flex items-center justify-center rounded-full transition-colors duration-200 ${
                  isDark ? "text-white" : "text-black"
                } bg-blue-600 text-white ${
                  region === "india" ? "w-5 h-7" : "w-6 h-8"
                }`}
              >
                {region === "india" ? "₹" : "$"}
              </span>
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
                      className={`w-full border ${
                        errors.initialCash
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 pr-16 py-1 rounded-lg text-black text-xs sm:text-base`}
                      placeholder={
                        errors.initialCash
                          ? errors.initialCash.message
                          : "Enter initial cash"
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-8 text-gray-500 p-0.5 rounded-lg"
                      onClick={() =>
                        field.onChange(
                          decrementValue("initialCash", field.value)
                        )
                      }
                    >
                      <FiMinus size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-1 text-gray-500 p-0.5 rounded-lg"
                      onClick={() =>
                        field.onChange(
                          incrementValue("initialCash", field.value)
                        )
                      }
                    >
                      <FiPlus size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div>
              <label className="block text-medium mt-1 mb-2">Start Date</label>
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
                      className={`w-full px-2 py-1 rounded-lg text-black text-base border ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      } focus:ring-blue-500 focus:border-transparent`}
                      placeholder={
                        errors.startDate
                          ? errors.startDate.message
                          : "YYYY/MM/DD"
                      }
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
            </div>

            <div>
              <label className="block text-base mt-1 mb-2">End Date</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="YYYY/MM/DD"
                      dateFormat="yyyy/MM/dd"
                      className={`w-full px-2 py-1 rounded-lg border ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      } text-black text-base focus:ring-blue-500 focus:border-transparent`}
                      placeholder={
                        errors.endDate ? errors.endDate.message : "YYYY/MM/DD"
                      }
                      popperClassName="!z-50 h-30" // Ensures the modal appears above other elements
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {!errors.marginProfit && (
                <label className="block text-base mt-1 mb-2">
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
                        className={`w-full border ${
                          errors.marginProfit
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-3 pr-16 py-1 rounded-lg text-black text-xs sm:text-base`}
                        placeholder={
                          errors.marginProfit
                            ? errors.marginProfit.message
                            : "00.00"
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-8 text-gray-500 p-0.5 rounded-lg"
                        onClick={() =>
                          field.onChange(
                            decrementValue("marginProfit", field.value, 0.1)
                          )
                        }
                      >
                        <FiMinus size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        type="button"
                        className="absolute right-1 text-gray-500 p-0.5 rounded-lg"
                        onClick={() =>
                          field.onChange(
                            incrementValue("marginProfit", field.value, 0.1)
                          )
                        }
                      >
                        <FiPlus size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>

            <div>
              {!errors.marginLoss && (
                <label className="block text-base mt-1 mb-2">
                  Margin Loss (%)
                </label>
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
                        className={`w-full px-3 pr-16 py-1 rounded-lg border ${
                          errors.marginLoss
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-black text-xs sm:text-base`}
                        placeholder={
                          errors.marginLoss
                            ? errors.marginLoss.message
                            : "00.00"
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-8 text-gray-500 p-0.5 rounded-lg"
                        onClick={() =>
                          field.onChange(
                            decrementValue("marginLoss", field.value, 0.1)
                          )
                        }
                      >
                        <FiMinus size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        type="button"
                        className="absolute right-1 text-gray-500 p-0.5 rounded-lg"
                        onClick={() =>
                          field.onChange(
                            incrementValue("marginLoss", field.value, 0.1)
                          )
                        }
                      >
                        <FiPlus size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
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
      <PricingDialog
        isOpen={isPricingDialogOpen}
        onClose={() => setIsPricingDialogOpen(false)}
      />

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
