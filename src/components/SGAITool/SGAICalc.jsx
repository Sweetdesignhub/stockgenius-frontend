import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { FiCalendar, FiMinus, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import Loading from "../common/Loading";

const SGAICalc = ({ onSimulationComplete }) => {
  const region = useSelector((state) => state.region); // Get region from store
  const [currency, setCurrency] = useState("₹");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const bgClass =
    theme === "dark"
      ? "text-white shadow-2xl ring-1 ring-black/30"
      : "text-gray-800 shadow-2xl ring-1 t ring-white/30";
  // shadow-2xl backdrop-blur-md
  const isDark = theme === "dark";

  useEffect(() => {
    if (region === "india") {
      setCurrency("₹");
    } else {
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
  };
  const formatDate = (date) => {
    const [year, month, day] = date.split("/"); // Split the date by '/'
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("Data inout ois", data);
    try {
      const response = await fetch("http://localhost:8000/run-simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initial_cash: parseFloat(data.initialCash),
          start_date: formatDate(data.startDate),
          end_date: formatDate(data.endDate),
          profit_margin: parseFloat(data.marginProfit),
          loss_margin: parseFloat(data.marginLoss),
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      console.log("result is: ", result.data);
      if (onSimulationComplete) {
        onSimulationComplete({
          formValues: {
            ...data,
            currency,
          },
          results: {
            ...result.data,
            currency,
          },
        });
      }
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsLoading(false);
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
      className={`max-w-3xl  mx-auto p-6 rounded-xl backdrop-blur-md ${bgClass} 
  `}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <h1 className="text-base md:text-2xl font-bold">
            SGAI - Investment Simulation Tool
          </h1>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-white text-red-500 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        className={` w-full mb-6 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          {/* Initial Cash */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-lg">Initial Cash</label>
              <RadioGroup
                value={currency}
                onChange={setCurrency}
                className="flex"
              >
                <RadioGroup.Option value="₹">
                  {({ checked }) => (
                    <span
                      className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                        checked
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      ₹
                    </span>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option value="$" className="ml-2">
                  {({ checked }) => (
                    <span
                      className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                        checked
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-300 text-black"
                      }`}
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
                rules={{ required: "Initial cash is required" }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-white text-black text-lg"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-lg mb-2">Start Date</label>
              <div className="relative">
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-white text-black text-lg"
                        placeholder="YYYY/MM/DD"
                      />
                      <FiCalendar
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  )}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-red-400">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-lg mb-2">End Date</label>
              <div className="relative">
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-white text-black text-lg"
                        placeholder="YYYY/MM/DD"
                      />
                      <FiCalendar
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  )}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-red-400">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Margin Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Margin Profit */}
            <div>
              <label className="block text-lg mb-2">Margin Profit (%)</label>
              <div className="relative">
                <Controller
                  name="marginProfit"
                  control={control}
                  rules={{ required: "Margin profit is required" }}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-white text-black text-lg"
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
              {errors.marginProfit && (
                <p className="mt-1 text-red-400">
                  {errors.marginProfit.message}
                </p>
              )}
            </div>

            {/* Margin Loss */}
            <div>
              <label className="block text-lg mb-2">Margin Loss (%)</label>
              <div className="relative">
                <Controller
                  name="marginLoss"
                  control={control}
                  rules={{ required: "Margin loss is required" }}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-white text-black text-lg"
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
              {errors.marginLoss && (
                <p className="mt-1 text-red-400">{errors.marginLoss.message}</p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 mt-4 bg-blue-600 rounded-full text-white font-medium text-lg hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <CalcLoading className="h-2" /> : "Run Simulation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SGAICalc;

const CalcLoading = () => (
  <div className="flex justify-center h-2 items-center h-screen px-6 py-3 ">
    <div className="animate-spin rounded-full h-2 w-2 border-b-2 dark:border-white border-gray-900"></div>
    <h1 className="mx-2">Loading</h1>
  </div>
);
