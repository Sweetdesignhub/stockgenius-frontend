import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { paperTradeApi, paperTradeUsaApi } from "../../config";
import { ToggleRight, ToggleLeft } from "lucide-react";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { Dialog } from "@headlessui/react";

const PlaceOrderModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const region = useSelector((state) => state.region);
  const market = useSelector((state) => state.market);
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    stockSymbol: initialData?.symbol || "", // Stock symbol pre-filled
    action: "BUY",
    orderType: "MARKET", // Default order type
    quantity: initialData?.quantity || "",
    limitPrice: "",
    stopPrice: "",
    exchange: region === "usa" ? market : "NSE",
    productType: "CNC", // Default product type
  });

  const [isQuickOrder, setIsQuickOrder] = useState(false); // Toggle state for quick vs regular order
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData((prev) => ({
        ...prev,
        stockSymbol: initialData.symbol || "",
        action: initialData.action || "BUY",
        quantity: initialData.quantity || "",
        // Keep other form fields as they are
        orderType: prev.orderType,
        limitPrice: prev.limitPrice,
        stopPrice: prev.stopPrice,
        exchange: prev.exchange,
        productType: prev.productType,
      }));
      setError("");
      setShowConfirmation(false);
    }
  }, [isOpen, initialData, region, market]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    // Only allow one order type to be selected
    setFormData((prevState) => ({
      ...prevState,
      orderType: value, // Ensure only one order type is selected
    }));
  };

  const handleActionToggle = () => {
    setFormData((prev) => ({
      ...prev,
      action: prev.action === "BUY" ? "SELL" : "BUY",
    }));
  };

  const handleOrderTypeToggle = (type) => {
    setIsQuickOrder(type === "quick");
  };

  const getConfirmationMessage = () => {
    const orderDetails = [
      `<strong>Stock:</strong> ${formData.stockSymbol}`,
      `<strong>Quantity:</strong> ${formData.quantity}`,
      `<strong>Exchange:</strong> ${formData.exchange}`,
      `<strong>Order Type:</strong> ${formData.orderType}`,
    ];

    if (formData.orderType === "LIMIT" || formData.orderType === "STOP_LIMIT") {
      orderDetails.push(
        `<strong>Limit Price:</strong> ₹${formData.limitPrice}`
      );
    }
    if (
      formData.orderType === "STOP_LOSS" ||
      formData.orderType === "STOP_LIMIT"
    ) {
      orderDetails.push(`<strong>Stop Price:</strong> ₹${formData.stopPrice}`);
    }

    return `Are you sure you want to place this order?<br/><br/>${orderDetails.join(
      "<br/>"
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.quantity || formData.quantity <= 0) {
      setError("Quantity is required and must be greater than 0.");
      return;
    }

    // Don't close the modal here, let the confirmation handle it
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setLoading(true);
    setError("");

    const apiToUse = region === "usa" ? paperTradeUsaApi : paperTradeApi;

    try {
      const response = await apiToUse.post(
        `/api/v1/paper-trading/orders/placeOrder/${currentUser.id}`,
        formData
      );

      if (response.status === 201) {
        setShowConfirmation(false); // Hide the confirmation modal
        setShowSuccessModal(true); // Show the success modal
        onClose(); // Close the PlaceOrderModal
      } else {
        setError("Failed to place order. Please try again.");
        setShowConfirmation(false);
      }
    } catch (err) {
      // console.log(err.response.data.message);
      setError("Error placing order: " + err.response.data.message);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !showConfirmation && !showSuccessModal) return null;

  const isBuy = formData.action === "BUY";
  const actionColor = isBuy ? "blue" : "red";

  const modalContent = (
    <>
      {/* Only show the main modal if we're not in confirmation mode */}
      {isOpen && !showConfirmation && (
        <Dialog
          open={Boolean(isOpen && !showConfirmation)}
          as="div"
          className="relative z-50"
          onClose={onClose}
        >
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
            <Dialog.Panel className="w-full max-w-xs sm:max-w-lg mx-2 sm:mx-0 bg-[#1C1C1E] rounded-lg shadow-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div
                className={`px-3 sm:px-6 py-3 sm:py-4 border-b-gray-900 bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)] text-white rounded-t-lg`}
              >
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-lg font-semibold">
                  {formData.stockSymbol}
                </span>
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Toggle Icon: Conditional Rendering based on action */}
                  {isBuy ? (
                    <ToggleLeft
                      onClick={handleActionToggle}
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-blue-200"
                    />
                  ) : (
                    <ToggleRight
                      onClick={handleActionToggle}
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-red-200"
                    />
                  )}
                </div>
              </div>

              {/* Radio Buttons moved to header */}
              {region === "india" && (
                <div className="flex gap-4 sm:gap-8 mt-2 sm:mt-3">
                  <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="exchange"
                      value="NSE"
                      checked={formData.exchange === "NSE"}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    NSE {initialData.price}
                    <input
                      type="radio"
                      name="exchange"
                      value="BSE"
                      checked={formData.exchange === "BSE"}
                      onChange={handleChange}
                      className="mr-1 ml-2"
                    />
                    BSE {initialData.price}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Type Toggle Buttons: Quick vs Regular */}
          <div className="flex gap-1 sm:gap-2 p-2 sm:p-4 border-t">
            <button
              onClick={() => handleOrderTypeToggle("quick")}
              className={`px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-lg border ${
                isQuickOrder
                  ? "border-blue-500 text-blue-500 bg-white"
                  : "border-[#1C1C1E] text-white hover:bg-gray-900"
              }`}
            >
              Quick Order
            </button>
            <button
              onClick={() => handleOrderTypeToggle("regular")}
              className={`px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-lg border ${
                !isQuickOrder
                  ? "border-blue-500 text-blue-500 bg-white"
                  : "border-[#1C1C1E] text-white hover:bg-gray-900"
              }`}
            >
              Regular Order
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-6">
            {/* Product Type (Intraday / CNC) */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                Product Type
              </label>
              <div className="flex gap-3 sm:gap-4 text-white">
                <label className="flex items-center text-xs sm:text-sm">
                  <input
                    type="radio"
                    name="productType"
                    value="INTRADAY"
                    checked={formData.productType === "INTRADAY"}
                    onChange={handleChange}
                    className="mr-1 sm:mr-2"
                    disabled
                  />
                  Intraday
                </label>
                <label className="flex items-center text-xs sm:text-sm">
                  <input
                    type="radio"
                    name="productType"
                    value="CNC"
                    checked={formData.productType === "CNC"}
                    onChange={handleChange}
                    className="mr-1 sm:mr-2"
                  />
                  CNC
                </label>
              </div>
            </div>

            {/* Quick Order Mode: Show only Quantity and Buy/Cancel */}
            {isQuickOrder ? (
              <>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-900 bg-[#3A6FF8] rounded-lg p-2 text-white text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs text-[#235CEF] bg-white border rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-3 py-1.5 text-xs text-white rounded-lg ${
                      isBuy
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Placing..." : isBuy ? "Buy" : "Sell"}
                  </button>
                </div>
              </>
            ) : (
              // Regular Order Mode: Show all the fields
              <>
                {/* Order Type */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 text-white">
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="MARKET"
                        checked={formData.orderType === "MARKET"}
                        onChange={handleCheckboxChange}
                        className="mr-1 sm:mr-2"
                      />
                      Market
                    </label>
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="LIMIT"
                        checked={formData.orderType === "LIMIT"}
                        onChange={handleCheckboxChange}
                        className="mr-1 sm:mr-2"
                      />
                      Limit
                    </label>
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="STOP_LOSS"
                        checked={formData.orderType === "STOP_LOSS"}
                        onChange={handleCheckboxChange}
                        className="mr-1 sm:mr-2"
                      />
                      Stop Loss
                    </label>
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="STOP_LIMIT"
                        checked={formData.orderType === "STOP_LIMIT"}
                        onChange={handleCheckboxChange}
                        className="mr-1 sm:mr-2"
                      />
                      Stop Limit
                    </label>
                  </div>
                </div>

                {/* Limit Price (appears only for Limit or Stop Limit orders) */}
                {["LIMIT", "STOP_LIMIT"].includes(formData.orderType) && (
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Limit Price
                    </label>
                    <input
                      type="number"
                      name="limitPrice"
                      value={formData.limitPrice}
                      onChange={handleChange}
                      placeholder="Enter limit price"
                      className="w-full border border-gray-300 rounded-lg p-2 text-black text-xs sm:text-sm"
                    />
                  </div>
                )}

                {/* Stop Price (appears only for Stop Loss or Stop Limit orders) */}
                {["STOP_LOSS", "STOP_LIMIT"].includes(formData.orderType) && (
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Stop Price
                    </label>
                    <input
                      type="number"
                      name="stopPrice"
                      value={formData.stopPrice}
                      onChange={handleChange}
                      placeholder="Enter stop price"
                      className="w-full border border-gray-300 rounded-lg p-2 text-black text-xs sm:text-sm"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-800 bg-[#3A6FF8] rounded-lg p-2 text-white text-xs sm:text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs text-[#235CEF] bg-white border rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-3 py-1.5 text-xs text-white rounded-lg ${
                      isBuy
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Placing..." : isBuy ? "Buy" : "Sell"}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Show error message if there's an issue */}
          {error && (
            <div className="mx-3 sm:mx-6 mb-3 sm:mb-4 text-red-500 text-xs sm:text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              {error}
            </div>
          )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
      
      {/* Confirmation Modal */}
      <YesNoConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          onClose(); // Close the PlaceOrderModal when confirmation is canceled
        }}
        title={`Confirm ${formData.action} Order`}
        message={getConfirmationMessage()}
        onConfirm={handleConfirmedSubmit}
        isPlaceOrder={true}
        action={formData.action} // Add this prop
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onSubmit(formData);
        }}
        title="Order Placed Successfully"
        message={`Successfully placed order for ${formData.stockSymbol}`}
        onConfirm={() => {
          setShowSuccessModal(false);
          onSubmit(formData);
        }}
      />
    </>
  );

  return createPortal(modalContent, document.body);
};

export default PlaceOrderModal;
