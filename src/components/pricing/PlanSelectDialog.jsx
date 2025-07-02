import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../config";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice.js";

const stripePromise = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error("Stripe publishable key not found"));

const FeatureItem = ({ text, plan = "basic" }) => (
  <div className="flex items-center space-x-2 sm:space-x-3">
    <svg
      className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
        plan === "pro"
          ? "text-[rgba(69,252,252,1)]"
          : "text-[rgba(73,255,91,1)]"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
    <span className="text-sm sm:text-base text-gray-800 dark:text-gray-300">
      {text}
    </span>
  </div>
);

export default function PlanSelectDialog({
  isOpen = false,
  onClose,
  initialPlan = "pro",
}) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const hasProcessed = useRef(false);
  const sessionIdRef = useRef(null);

  const region = useSelector((state) => state.region);

  useEffect(() => {
    setSelectedPlan(initialPlan);
  }, [initialPlan]);

  const calculateMonthlyPrice = (planPrice, months) => {
    return Math.round(planPrice / months);
  };

  const handleUpgrade = async (plan, billingCycle) => {
    setLoadingPlan(`${plan}-${billingCycle}`);
    try {
      console.log(
        "Initiating checkout for plan:",
        plan,
        "billingCycle:",
        billingCycle,
        "Region:",
        region
      );

      const endpoint =
        region === "usa"
          ? "/api/v1/stripe/usa/plan/upgrade-usa"
          : "/api/v1/stripe/plan/upgrade";

      const requestBody =
        region === "usa"
          ? { plan, billingCycle, region: "USA" }
          : { plan, billingCycle };

      const response = await api.post(endpoint, requestBody, {
        withCredentials: true,
      });
      console.log("Checkout session response:", response.data);

      if (!response.data.sessionId) {
        throw new Error("No sessionId received from server");
      }

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Failed to redirect to Stripe Checkout"
        );
      }
    } catch (error) {
      console.error("Upgrade error:", error.message);
      alert(`Error: ${error.message || "Checkout failed"}`);
      setLoadingPlan(null);
    }
  };

  useEffect(() => {
    if (!isOpen || location.pathname !== "/payment/success") return;

    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");

    if (
      !sessionId ||
      hasProcessed.current ||
      sessionIdRef.current === sessionId
    )
      return;

    const handleSuccess = async () => {
      hasProcessed.current = true;
      sessionIdRef.current = sessionId;

      try {
        console.log("Processing session:", sessionId);
        const successResponse = await api.get(
          `/api/v1/stripe/success?session_id=${sessionId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Success response:", successResponse.data);

        dispatch(updateUserStart());
        const userResponse = await api.get("/api/v1/users/me", {
          withCredentials: true,
        });
        console.log("User data:", userResponse.data);

        // Normalize user object
        const normalizedUser = {
          ...userResponse.data,
          id: userResponse.data._id || userResponse.data.id,
        };
        delete normalizedUser._id;
        delete normalizedUser.success; // Remove success field if present

        dispatch(updateUserSuccess(normalizedUser));
        navigate(successResponse.data.redirect || "/india/AI-Trading-Bots", {
          replace: true,
        });
        onClose();
      } catch (error) {
        console.error("Success error:", error.message);
        dispatch(updateUserFailure(error.message));
        navigate("/payment/success", { replace: true });
      }
    };

    handleSuccess();
  }, [location.search, isOpen, dispatch, navigate, onClose]);

  return (
    <Transition appear show={isOpen || false} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
        </Transition.Child>

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
              <Dialog.Panel className="relative mx-auto w-full max-w-[1200px] min-h-screen sm:min-h-[700px] bg-white dark:bg-black/100 rounded-none sm:rounded-[10px] border border-gray-200 dark:border-gray-700 transform transition-all shadow-xl overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                  aria-label="Close dialog"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="flex flex-col w-full h-full">
                  <div className="w-full text-center py-4 sm:py-8">
                    <div className="text-center mb-4 sm:mb-6 md:mb-8 pt-6 sm:pt-3">
                      <h2 className="font-['Aldrich'] text-[20px] sm:text-[36px] md:text-[40px] font-normal leading-[100%] tracking-[0.02em] align-middle text-gray-900 dark:text-white">
                        StockScope Pass
                      </h2>
                    </div>
                    <div className="flex justify-center space-x-3 px-2 sm:px-0">
                      <button
                        onClick={() => setSelectedPlan("pro")}
                        className={`relative px-8 py-1 rounded-md transition-all duration-300 font-semibold border-[0.9px] text-white ${
                          selectedPlan === "pro" ? "scale-105" : "scale-95"
                        }`}
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B4D5C 132.95%)",
                          opacity: selectedPlan === "pro" ? 1 : 0.7,
                          borderImageSource:
                            "linear-gradient(180deg, rgba(11, 87, 92, 0.4) 17.19%, rgba(98, 223, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(11, 73, 92, 0) -4.69%, rgba(189, 246, 254, 0.3) 100%)",
                          borderImageSlice: "1",
                          backdropFilter: "blur(17.94871711730957px)",
                          WebkitBackdropFilter: "blur(17.94871711730957px)",
                          boxShadow:
                            "0px 8.97px 26.92px 0px rgba(73, 244, 255, 0.7) inset, 0px 8.97px 35.9px 0px rgba(11, 58, 92, 0.5)",
                        }}
                      >
                        <span className="relative z-10 text-sm">PRO PASS</span>
                      </button>
                      <button
                        onClick={() => setSelectedPlan("master")}
                        className={`relative px-4 py-1.5 rounded-lg transition-all duration-300 font-semibold border-[0.9px] text-white ${
                          selectedPlan === "master" ? "scale-105" : "scale-95"
                        }`}
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)",
                          opacity: selectedPlan === "master" ? 1 : 0.7,
                          borderImageSource:
                            "linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)",
                          borderImageSlice: "1",
                          backdropFilter: "blur(17.94871711730957px)",
                          WebkitBackdropFilter: "blur(17.94871711730957px)",
                          boxShadow:
                            "0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset, 0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)",
                        }}
                      >
                        <span className="relative z-10 text-sm">
                          MASTER PASS
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="w-full px-4 sm:px-8 pb-6">
                    <h3 className="font-['Poppins'] text-[20px] sm:text-[24px] font-semibold text-gray-800 dark:text-white mb-4 text-center">
                      Choose Your Subscription Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #88272D 132.95%)",
                          borderImageSource:
                            "linear-gradient(180deg, rgba(136, 39, 45, 0.4) 17.19%, rgba(251, 98, 107, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(136, 39, 45, 0) -4.69%, rgba(254, 189, 189, 0.3) 100%)",
                          borderImageSlice: 1,
                          backdropFilter: "blur(17.94871711730957px)",
                          boxShadow:
                            "0px 8.97px 26.92px 0px rgba(255, 73, 106, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 83, 0.5)",
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex flex-col items-start">
                              <span
                                className="font-['Poppins'] text-[108px] font-extrabold leading-[100%] tracking-[0.02em]"
                                style={{
                                  background: "rgba(222, 21, 21, 0.99)",
                                  WebkitBackgroundClip: "text",
                                  backgroundClip: "text",
                                  color: "transparent",
                                }}
                              >
                                12
                              </span>
                              <span
                                className="font-['Poppins'] text-[40px] font-semibold leading-[22px]"
                                style={{ color: "rgba(255, 255, 255, 1)" }}
                              >
                                Months
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-white">
                              {selectedPlan === "pro" ? "200" : "400"}$
                            </span>
                            <span className="text-gray-200 font-bold mt-3">
                              {calculateMonthlyPrice(
                                selectedPlan === "pro" ? 200 : 400,
                                12
                              )}
                              /month
                            </span>
                          </div>
                        </div>
                        <ul className="mb-6 space-y-2">
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Best value for money
                          </li>
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            20% discount applied
                          </li>
                        </ul>
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              console.log(
                                `Selected ${selectedPlan.toUpperCase()} Yearly Plan`
                              );
                              handleUpgrade(selectedPlan, "12_months");
                            }}
                            className={`w-[165px] h-[35px] rounded-[7.18px] font-semibold text-white transition-all duration-300 ${
                              loadingPlan === `${selectedPlan}-12_months`
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            disabled={
                              loadingPlan === `${selectedPlan}-12_months`
                            }
                            tabIndex={0}
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #88272D 132.95%)",
                              borderImageSource:
                                "linear-gradient(180deg, rgba(136, 39, 45, 0.4) 17.19%, rgba(251, 98, 107, 0.77)), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(136, 39, 45, 0) -4.69%, rgba(254, 189, 189, 0.3) 100%)",
                              borderImageSlice: "1",
                              gap: "10.77px",
                              backdropFilter: "blur(17.94871711730957px)",
                              boxShadow:
                                "0px 8.97px 26.92px 0px rgba(255, 73, 106, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 83, 0.5)",
                            }}
                          >
                            {loadingPlan === `${selectedPlan}-12_months`
                              ? "Processing..."
                              : "Buy Now"}
                          </button>
                        </div>
                      </div>
                      <div
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #882776 132.95%)",
                          borderImageSource:
                            "linear-gradient(180deg, rgba(136, 39, 118, 0.4) 17.19%, rgba(251, 98, 241, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(136, 39, 118, 0) -4.69%, rgba(254, 189, 245, 0.3) 100%)",
                          borderImageSlice: 1,
                          backdropFilter: "blur(17.94871711730957px)",
                          boxShadow:
                            "0px 8.97px 26.92px 0px rgba(255, 73, 242, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 159, 0.5)",
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex flex-col items-start">
                              <span
                                className="font-['Poppins'] text-[108px] font-extrabold leading-[100%] tracking-[0.02em]"
                                style={{
                                  background: "rgba(222, 21, 203, 0.99)",
                                  WebkitBackgroundClip: "text",
                                  backgroundClip: "text",
                                  color: "transparent",
                                }}
                              >
                                3
                              </span>
                              <span
                                className="font-['Poppins'] text-[40px] font-semibold leading-[22px]"
                                style={{ color: "rgba(255, 255, 255, 1)" }}
                              >
                                Months
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-white">
                              {selectedPlan === "pro" ? "60" : "120"}$
                            </span>
                            <span className="text-gray-200 font-bold mt-3">
                              {calculateMonthlyPrice(
                                selectedPlan === "pro" ? 60 : 120,
                                3
                              )}
                              /month
                            </span>
                          </div>
                        </div>
                        <ul className="mb-6 space-y-2">
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            3 months access
                          </li>
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            10% discount applied
                          </li>
                        </ul>
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              console.log(
                                `Selected ${selectedPlan.toUpperCase()} Half Yearly Plan`
                              );
                              handleUpgrade(selectedPlan, "3_months");
                            }}
                            className={`w-[165px] h-[35px] rounded-[7.18px] font-semibold text-white transition-all duration-300 ${
                              loadingPlan === `${selectedPlan}-3_months`
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={
                              loadingPlan === `${selectedPlan}-3_months`
                            }
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #882776 132.95%)",
                              borderImageSource:
                                "linear-gradient(180deg, rgba(136, 39, 118, 0.4) 17.19%, rgba(251, 98, 241, 0.77)), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(136, 39, 118, 0) -4.69%, rgba(254, 189, 245, 0.3) 100%)",
                              borderImageSlice: "1",
                              gap: "10.77px",
                              backdropFilter: "blur(17.94871711730957px)",
                              boxShadow:
                                "0px 8.97px 26.92px 0px rgba(255, 73, 243, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 159, 0.5)",
                            }}
                          >
                            {loadingPlan === `${selectedPlan}-3_months`
                              ? "Processing..."
                              : "Buy Now"}
                          </button>
                        </div>
                      </div>
                      <div
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #200B5C 132.95%)",
                          borderImageSource:
                            "linear-gradient(180deg, rgba(32, 11, 92, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(32, 11, 92, 0) -4.69%, rgba(203, 189, 254, 0.3) 100%)",
                          borderImageSlice: 1,
                          backdropFilter: "blur(17.94871711730957px)",
                          boxShadow:
                            "0px 8.97px 26.92px 0px rgba(109, 73, 255, 0.7) inset, 0px 8.97px 35.9px 0px rgba(54, 63, 175, 0.5)",
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex flex-col items-start">
                              <span
                                className="font-['Poppins'] text-[108px] font-extrabold leading-[100%]"
                                style={{
                                  background: "rgba(21, 68, 222, 0.99)",
                                  WebkitBackgroundClip: "text",
                                  color: "transparent",
                                }}
                              >
                                1
                              </span>
                              <span
                                className="font-['Poppins'] text-[40px] font-semibold leading-[22px]"
                                style={{ color: "rgba(255, 255, 255, 1)" }}
                              >
                                Month
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-white">
                              {selectedPlan === "pro" ? "25" : "50"}$
                            </span>
                            <span className="text-gray-200 font-bold mt-3">
                              {calculateMonthlyPrice(
                                selectedPlan === "pro" ? 25 : 50,
                                1
                              )}
                              /month
                            </span>
                          </div>
                        </div>
                        <ul className="mb-6 space-y-2">
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            1 month access
                          </li>
                          <li className="flex items-center text-gray-200">
                            <svg
                              className="w-4 h-4 mr-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Pay as you go
                          </li>
                        </ul>
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              console.log(
                                `Selected ${selectedPlan.toUpperCase()} Quarterly Plan`
                              );
                              handleUpgrade(selectedPlan, "1_month");
                            }}
                            className={`w-[165px] h-[35px] rounded-[7.18px] font-semibold text-white transition-all duration-300 ${
                              loadingPlan === `${selectedPlan}-1_month`
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={loadingPlan === `${selectedPlan}-1_month`}
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #200B5C 132.95%)",
                              borderImageSource:
                                "linear-gradient(180deg, rgba(32, 11, 92, 0.4) 17.19%, rgba(101, 98, 251, 0.77)), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(32, 11, 92, 0) -4.69%, rgba(203, 189, 254, 0.3) 100%)",
                              borderImageSlice: "1",
                              gap: "10.77px",
                              backdropFilter: "blur(17.94871711730957px)",
                              boxShadow:
                                "0px 8.97px 26.92px 0px rgba(109, 73, 255, 0.7) inset, 0px 8.97px 35.9px 0px rgba(54, 63, 175, 0.5)",
                            }}
                          >
                            {loadingPlan === `${selectedPlan}-1_month`
                              ? "Processing..."
                              : "Buy Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
