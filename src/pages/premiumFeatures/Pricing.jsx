import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../config";
import { useSelector } from "react-redux";
const stripePromise = loadStripe(
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
);

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const region = useSelector((state) => state.region);

  const handleUpgrade = async (plan, billingCycle) => {
    setLoading(true);
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
      if (!stripe) {
        throw new Error("Stripe.js failed to load");
      }

      console.log(
        "Attempting redirect with sessionId:",
        response.data.sessionId
      );
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      // redirectToCheckout returns { error } if it fails
      if (result.error) {
        console.error("Stripe redirect result:", result);
        throw new Error(
          result.error.message || "Failed to redirect to Stripe Checkout"
        );
      }
    } catch (error) {
      console.error("Upgrade error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
        name: error.name,
      });
      const errorMessage =
        error.message ||
        error.response?.data?.error ||
        "An unexpected error occurred during checkout";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="border p-4">
          <h2 className="text-xl">Basic</h2>
          <p>Free for 7 days</p>
          <p>Limited features</p>
        </div>
        <div className="border p-4">
          <h2 className="text-xl">Pro</h2>
          <p>$25/1 month, $60/3 months, $200/12 months</p>
          <button
            onClick={() => handleUpgrade("pro", "1_month")}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Pro (1 month)
          </button>
          <button
            disabled={loading}
            onClick={() => handleUpgrade("pro", "3_months")}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Pro (3 months)
          </button>
          <button
            onClick={() => handleUpgrade("pro", "12_months")}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Pro (12 months)
          </button>
        </div>
        <div className="border p-4">
          <h2 className="text-xl">Master</h2>
          <p>$50/1 month, $120/3 months, $400/12 months</p>
          <button
            onClick={() => handleUpgrade("master", "1_month")}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Master (1 month)
          </button>
          <button
            onClick={() => handleUpgrade("master", "3_months")}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Master (3 months)
          </button>
          <button
            onClick={() => handleUpgrade("master", "12_months")}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy Master (12 months)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
