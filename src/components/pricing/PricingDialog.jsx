import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PlanDetailsDialog from "./PlanDetailsDialog";
import { useSelector } from "react-redux";
import PRICING_PLANS from "./PricingPlansValues";

export default function PricingDialog({ isOpen = false, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const region = useSelector((state) => state.region);

  const currentPlan = currentUser?.plan || "basic"; // Fallback to "basic" if undefined
  // console.log(currentUser);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(
    currentPlan === "basic" ? "pro" : currentPlan
  );

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowPlanDialog(true);
    onClose(); // Close the pricing dialog when plan details opens
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* Background overlay with blur */}
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>{" "}
          {/* Dialog position wrapper - centers dialog vertically and horizontally */}{" "}
          <div className="fixed inset-0 flex items-start sm:items-center justify-center overflow-y-auto scrollbar-hide">
            <div className="flex min-h-full w-full items-start sm:items-center justify-center p-2 sm:p-4">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                className="w-full"
              >
                {" "}
                {/* Dialog panel with responsive width and height */}{" "}
                <Dialog.Panel
                  className="relative mx-auto
                w-full sm:w-[calc(100%-2rem)] max-w-[1200px] min-h-screen 
                sm:min-h-[700px] md:min-h-[650px] lg:min-h-[600px] xl:min-h-[700px]
                sm:h-[700px] md:h-[650px] lg:h-[600px] xl:h-[700px]
                1024:w-[1000px] 1024:h-[600px]
                1440:w-[1200px] 1440:h-[700px]
                bg-white dark:bg-black/80 rounded-none sm:rounded-[10px] 
                border border-gray-200 dark:border-gray-700
                transform transition-all shadow-xl sm:my-4 overflow-hidden"
                >
                  {/* Close button - stays in position */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    text-gray-500 dark:text-gray-400 
                    hover:text-gray-700 dark:hover:text-gray-200
                    transition-colors z-10"
                    aria-label="Close pricing dialog"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  {/* Content container with proper padding and no scroll */}{" "}
                  <div className="p-2 sm:p-4 md:p-5 lg:p-6 xl:p-8 w-full h-full flex flex-col">
                    {/* Pricing title */}{" "}
                    <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 pt-4 sm:pt-3">
                      {" "}
                      <h2 className="font-['Aldrich'] text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-normal leading-[100%] tracking-[0.02em] align-middle text-gray-900 dark:text-white">
                        StockScope Pass
                      </h2>
                    </div>
                    {/* Pricing grid - responsive columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 max-w-7xl mx-auto flex-1">
                      {/* Basic Plan */}
                      <div
                        className="flex flex-col h-[520px] sm:h-[550px] md:h-[480px] lg:h-[450px] xl:h-[550px] p-2 pb-1 sm:p-3 sm:pb-2 md:p-3 md:pb-2 lg:p-3 lg:pb-2 xl:p-4 xl:pb-3 text-center text-gray-900 dark:text-white
                      rounded-lg border border-gray-200 dark:border-gray-700 
                      shadow-lg transition-all duration-200 hover:shadow-xl"
                        style={{
                          background: `linear-gradient(180deg, rgba(255, 230, 7, 0.1) 99.99%, rgba(51, 46, 27, 0.02) 100%),
                                   radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
                        }}
                      >
                        <div className="flex-none">
                          {/* Image and header section */}{" "}
                          <div className="relative mb-1 sm:mb-2 mx-auto w-full max-w-[220px] sm:max-w-[240px] md:max-w-[200px] lg:max-w-[180px] xl:max-w-[320px] h-[140px] sm:h-[150px] md:h-[120px] lg:h-[110px] xl:h-[218px]">
                            <img
                              loading="lazy"
                              src={
                                "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F6828d46de1f14fceb4b40e36d8c28d11"
                              }
                              alt="Basic Plan"
                              className="w-full h-full object-cover object-center rounded-[7.62px] border-[0.69px] border-gray-200 dark:border-gray-700"
                            />
                          </div>{" "}
                          <div className="text-left mb-1 sm:mb-2 flex justify-between items-center">
                            <div className="flex-1">
                              {" "}
                              <p className="font-['Poppins'] text-[16px] sm:text-[18px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-gray-900 font-bold dark:text-white">
                                STOCKSCOPE PASS
                              </p>
                              <p className="text-lg font-bold text-[24px] sm:text-[26px] md:text-[22px] lg:text-[26px] xl:text-[30px] text-[rgba(222,178,21,1)]">
                                Basic
                              </p>
                            </div>{" "}
                            <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-gray-900 dark:text-white">
                              <span className="font-bold">
                                Free (
                                {PRICING_PLANS[region]?.basic?.price || "$ 0"})
                              </span>
                            </p>
                          </div>{" "}
                          {/* Features list */}
                          <p className="text-left font-semibold text-gray-900 dark:text-white mt-4 sm:mt-6 md:mt-4 lg:mt-5 xl:mt-8 mb-2 sm:mb-3 md:mb-2 lg:mb-3 xl:mb-4 ml-1 text-sm sm:text-base md:text-sm lg:text-base">
                            Unlimited access to
                          </p>
                          <ul className="space-y-1 sm:space-y-2 text-left text-xs sm:text-sm md:text-xs lg:text-sm pl-2">
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.basic?.description ||
                                  "Free Access"}
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.basic
                                  ?.paperTradeFundCap || "1 lakh"}{" "}
                                funds cap (Paper Trading)
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.basic
                                  ?.simulationLimit || "5 simulations/month"}
                              </span>
                            </li>
                          </ul>
                        </div>{" "}
                        <div className="mt-auto pb-1 sm:pb-2">
                          {currentPlan === "basic" ? (
                            <p className="font-['Poppins'] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-semibold text-[rgba(222,178,21,1)]">
                              Your Current Plan
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {/* Pro Plan */}
                      <div
                        className="flex flex-col h-[520px] sm:h-[550px] md:h-[480px] lg:h-[450px] xl:h-[550px] p-2 pb-1 sm:p-3 sm:pb-2 md:p-3 md:pb-2 lg:p-3 lg:pb-2 xl:p-4 xl:pb-3 text-center text-gray-900 dark:text-white
                      rounded-lg border border-gray-200 dark:border-gray-700 
                      shadow-lg transition-all duration-200 hover:shadow-xl"
                        style={{
                          background: `linear-gradient(180deg, rgba(0, 255, 240, 0.1) 99.99%, rgba(27, 51, 51, 0.02) 100%),
                                   radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
                        }}
                      >
                        <div className="flex-none">
                          {" "}
                          {/* Image and header section */}{" "}
                          <div className="relative mb-1 sm:mb-2 mx-auto w-full max-w-[220px] sm:max-w-[240px] md:max-w-[200px] lg:max-w-[180px] xl:max-w-[320px] h-[140px] sm:h-[150px] md:h-[120px] lg:h-[110px] xl:h-[218px]">
                            <img
                              loading="lazy"
                              src={
                                "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb6caa97ae2eb49a58ba06b49427e93e1"
                              }
                              alt="Pro Plan"
                              className="w-full h-full object-cover object-center rounded-[7.62px] border-[0.69px] border-gray-200 dark:border-gray-700"
                            />
                          </div>
                          <div className="text-left mb-1 sm:mb-2 flex justify-between items-center">
                            <div className="flex-1">
                              {" "}
                              <p className="font-['Poppins'] text-[16px] sm:text-[18px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-bold text-gray-900 dark:text-white">
                                STOCKSCOPE PASS
                              </p>
                              <p className="text-lg font-bold text-[24px] sm:text-[26px] md:text-[22px] lg:text-[26px] xl:text-[30px] text-[rgba(69,252,252,1)]">
                                Pro
                              </p>
                            </div>
                            <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-gray-900 dark:text-white">
                              <span className="font-bold">
                                {PRICING_PLANS[region]?.pro?.price || "$ 25"}
                              </span>
                              / month
                            </p>
                          </div>{" "}
                          {/* Features list */}
                          <p className="text-left font-semibold text-gray-900 dark:text-white mt-4 sm:mt-6 md:mt-4 lg:mt-5 xl:mt-8 mb-2 sm:mb-3 md:mb-2 lg:mb-3 xl:mb-4 ml-1 text-sm sm:text-base md:text-sm lg:text-base">
                            Unlimited access to
                          </p>
                          <ul className="space-y-1 sm:space-y-2 text-left text-xs sm:text-sm md:text-xs lg:text-sm pl-2">
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.pro
                                  ?.paperTradeFundCap || "10 lakhs"}{" "}
                                funds cap (Paper Trading)
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.pro
                                  ?.aiBotTransactionLimit ||
                                  "10 daily/50 weekly transactions using bots"}
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.pro?.description ||
                                  "Past 7 days per ticker (News & Sentiments)"}
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {" "}
                                {PRICING_PLANS[region]?.pro?.simulationLimit ||
                                  "25 simulations/month"}
                              </span>
                            </li>
                          </ul>{" "}
                        </div>{" "}
                        <div className="mt-auto pb-1 sm:pb-2 flex justify-center">
                          {currentPlan === "pro" ? (
                            <p className="font-['Poppins'] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-semibold text-[rgba(69,252,252,1)]">
                              Your Current Plan
                            </p>
                          ) : currentPlan === "basic" ? (
                            <button
                              onClick={() => handlePlanClick("pro")}
                              className="w-[120px] sm:w-[135px] md:w-[120px] lg:w-[135px] xl:w-[142px] h-[30px] sm:h-[33px] md:h-[30px] lg:h-[33px] xl:h-[36px] rounded-[7.18px] border-[0.9px] px-[20px] sm:px-[24px] md:px-[20px] lg:px-[24px] xl:px-[26.92px]
                            text-white font-['Poppins'] font-semibold text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] text-center align-middle
                            backdrop-blur-[17.95px]"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B575C 132.95%)",
                                borderImageSource: `linear-gradient(180deg, rgba(11, 87, 92, 0.4) 17.19%, rgba(98, 223, 251, 0.77) 100%),
                                linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
                                linear-gradient(180deg, rgba(11, 58, 92, 0) -4.69%, rgba(189, 246, 254, 0.3) 100%)`,
                                boxShadow: `0px 8.97px 26.92px 0px rgba(73, 244, 255, 0.7) inset,
                                0px 8.97px 35.9px 0px rgba(11, 58, 92, 0.5)`,
                              }}
                            >
                              Buy Now
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Master Plan */}
                      <div
                        className="flex flex-col h-[520px] sm:h-[550px] md:h-[480px] lg:h-[450px] xl:h-[550px] p-2 pb-1 sm:p-3 sm:pb-2 md:p-3 md:pb-2 lg:p-3 lg:pb-2 xl:p-4 xl:pb-3 text-center text-gray-900 dark:text-white
                      rounded-lg border border-gray-200 dark:border-gray-700 
                      shadow-lg transition-all duration-200 hover:shadow-xl"
                        style={{
                          background: `linear-gradient(180deg, rgba(0, 255, 26, 0.1) 99.99%, rgba(27, 51, 31, 0.02) 100%),
                                   radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
                        }}
                      >
                        <div className="flex-none">
                          {/* Image and header section */}{" "}
                          <div className="relative mb-1 sm:mb-2 mx-auto w-full max-w-[220px] sm:max-w-[240px] md:max-w-[200px] lg:max-w-[180px] xl:max-w-[320px] h-[140px] sm:h-[150px] md:h-[120px] lg:h-[110px] xl:h-[218px]">
                            <img
                              loading="lazy"
                              src={
                                "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fa909a5df465642789cd5ee20a8eeb509"
                              }
                              alt="Master Plan"
                              className="w-full h-full object-cover object-center rounded-[7.62px] border-[0.69px] border-gray-200 dark:border-gray-700 transform -scale-x-100"
                            />
                          </div>{" "}
                          <div className="text-left mb-1 sm:mb-2 flex justify-between items-center">
                            <div className="flex-1">
                              {" "}
                              <p className="font-['Poppins'] text-[16px] sm:text-[18px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-bold text-gray-900 dark:text-white">
                                STOCKSCOPE PASS
                              </p>
                              <p className="text-lg font-bold text-[24px] sm:text-[26px] md:text-[22px] lg:text-[26px] xl:text-[30px] text-[rgba(21,222,115,1)]">
                                Master
                              </p>
                            </div>
                            <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-gray-900 dark:text-white">
                              <span className="font-bold">
                                {PRICING_PLANS[region]?.master?.price || "$ 50"}
                              </span>
                              /month
                            </p>
                          </div>{" "}
                          {/* Features list */}
                          <p className="text-left font-semibold text-gray-900 dark:text-white mt-4 sm:mt-6 md:mt-4 lg:mt-5 xl:mt-8 mb-2 sm:mb-3 md:mb-2 lg:mb-3 xl:mb-4 ml-1 text-sm sm:text-base md:text-sm lg:text-base">
                            Unlimited access to
                          </p>
                          <ul className="space-y-1 sm:space-y-2 text-left text-xs sm:text-sm md:text-xs lg:text-sm pl-2">
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.master
                                  ?.paperTradeFundCap || "50 lakhs"}{" "}
                                funds cap (Paper Trading)
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.master
                                  ?.aiBotTransactionLimit ||
                                  "Unlimited bots, full trading hours"}
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.master?.description ||
                                  "Full history with insights"}
                              </span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <svg
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span>
                                {PRICING_PLANS[region]?.master
                                  ?.simulationLimit || "Unlimited simulations "}
                                (News & Sentiments)
                              </span>
                            </li>
                          </ul>{" "}
                        </div>{" "}
                        <div className="mt-auto pb-1 sm:pb-2 flex justify-center">
                          {currentPlan === "master" ? (
                            <p className="font-['Poppins'] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-semibold text-[rgba(21,222,115,1)]">
                              Your Current Plan
                            </p>
                          ) : (
                            <button
                              onClick={() => handlePlanClick("master")}
                              className="w-[120px] sm:w-[135px] md:w-[120px] lg:w-[135px] xl:w-[142px] h-[30px] sm:h-[33px] md:h-[30px] lg:h-[33px] xl:h-[36px] rounded-[7.18px] border-[0.9px] px-[20px] sm:px-[24px] md:px-[20px] lg:px-[24px] xl:px-[26.92px]
                            text-white font-['Poppins'] font-semibold text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] text-center align-middle
                            backdrop-blur-[17.95px]"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)",
                                borderImageSource: `linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%),
                                linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
                                linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)`,
                                boxShadow: `0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset,
                                0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)`,
                              }}
                            >
                              Buy Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>{" "}
      <PlanDetailsDialog
        isOpen={showPlanDialog}
        onClose={() => setShowPlanDialog(false)}
        initialPlan={selectedPlan}
      />
    </>
  );
}
