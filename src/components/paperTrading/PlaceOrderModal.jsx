import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config";
import { ToggleRight, ToggleLeft } from "lucide-react";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";

const PlaceOrderModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    stockSymbol: initialData?.symbol || "", // Stock symbol pre-filled
    action: "BUY",
    orderType: "MARKET", // Default order type
    quantity: initialData?.quantity || "",
    limitPrice: "",
    stopPrice: "",
    exchange: "NSE", // Default exchange
    productType: "CNC", // Default product type
  });

  const { currentUser } = useSelector((state) => state.user);
  const [isQuickOrder, setIsQuickOrder] = useState(false); // Toggle state for quick vs regular order
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // useEffect(() => {
  //   // Reset form data when modal is opened
  //   if (isOpen) {
  //     setFormData({
  //       stockSymbol: initialData?.symbol || "",
  //       action: initialData?.action || "BUY",
  //       orderType: "MARKET",
  //       quantity: initialData.quantity || "",
  //       limitPrice: "",
  //       stopPrice: "",
  //       exchange: "NSE",
  //       productType: "CNC",
  //     });
  //     setError(""); // Clear previous error
  //     setShowConfirmation(false);
  //   }
  // }, [isOpen, initialData]);

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
  }, [isOpen, initialData]);

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

    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        `/api/v1/paper-trading/orders/place/${currentUser.id}`,
        formData
      );

      if (response.status === 201) {
        setShowConfirmation(false); // First hide the confirmation modal
        setShowSuccessModal(true); // Then show the success modal

        // Only close the main modal and call onSubmit after user acknowledges success
        const handleSuccessClose = () => {
          setShowSuccessModal(false);
          onSubmit(formData);
          onClose();
        };

        // Update the success modal close handler
        const oldOnClose = onClose;
        onClose = () => {
          handleSuccessClose();
          oldOnClose();
        };
      } else {
        setError("Failed to place order. Please try again.");
        setShowConfirmation(false);
      }
    } catch (err) {
      console.log(err.response.data.message);
      setError("Error placing order: " + err.response.data.message);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isBuy = formData.action === "BUY";
  const actionColor = isBuy ? "blue" : "red";

  return (
    <>
      <div className="fixed inset-0 z-1 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-lg bg-[#1C1C1E] rounded-lg shadow-lg">
          {/* Modal Header */}
          <div
            className={`px-6 py-4 border-b-gray-900 bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)] text-white`}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {formData.stockSymbol}
                </span>
                <div className="flex items-center gap-4">
                  {/* Toggle Icon: Conditional Rendering based on action */}
                  {isBuy ? (
                    <ToggleLeft
                      onClick={handleActionToggle}
                      className="w-6 h-6 cursor-pointer hover:text-blue-200"
                    />
                  ) : (
                    <ToggleRight
                      onClick={handleActionToggle}
                      className="w-6 h-6 cursor-pointer hover:text-red-200"
                    />
                  )}
                </div>
              </div>

              {/* Radio Buttons moved to header */}
              <div className="flex gap-8 mt-3">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="exchange"
                    value="NSE"
                    checked={formData.exchange === "NSE"}
                    onChange={handleChange}
                    className="mr-0"
                  />
                  NSE {initialData.price}
                  <input
                    type="radio"
                    name="exchange"
                    value="BSE"
                    checked={formData.exchange === "BSE"}
                    onChange={handleChange}
                    className="mr-0"
                  />
                  BSE {initialData.price}
                </div>
              </div>
            </div>
          </div>

          {/* Order Type Toggle Buttons: Quick vs Regular */}
          <div className="flex gap-2 p-4 border-t mb-">
            <button
              onClick={() => handleOrderTypeToggle("quick")}
              className={`px-4 py-1 text-sm rounded-lg border ${
                isQuickOrder
                  ? "border-blue-500 text-blue-500 bg-white"
                  : "border-[#1C1C1E] text-white hover:bg-gray-900"
              }`}
            >
              Quick Order
            </button>
            <button
              onClick={() => handleOrderTypeToggle("regular")}
              className={`px-4 py-1 text-sm rounded-lg border ${
                !isQuickOrder
                  ? "border-blue-500 text-blue-500 bg-white"
                  : "border-[#1C1C1E] text-white hover:bg-gray-900"
              }`}
            >
              Regular Order
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Product Type (Intraday / CNC) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">
                Product Type
              </label>
              <div className="flex gap-4 mt-1 text-white">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productType"
                    value="INTRADAY"
                    checked={formData.productType === "INTRADAY"}
                    onChange={handleChange}
                    className="mr-2"
                    disabled
                  />
                  Intraday
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productType"
                    value="CNC"
                    checked={formData.productType === "CNC"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  CNC
                </label>
              </div>
            </div>

            {/* Quick Order Mode: Show only Quantity and Buy/Cancel */}
            {isQuickOrder ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full mt-1 border border-gray-900 bg-[#3A6FF8] rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-[#235CEF] bg-white border rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm text-white rounded-lg ${
                      isBuy
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? "Placing Order..." : isBuy ? "Buy" : "Sell"}
                  </button>
                </div>
              </>
            ) : (
              // Regular Order Mode: Show all the fields
              <>
                {/* Order Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">
                    Order Type
                  </label>
                  <div className="flex gap-4 mt-1 text-white">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="MARKET"
                        checked={formData.orderType === "MARKET"}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Market
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="LIMIT"
                        checked={formData.orderType === "LIMIT"}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Limit
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="STOP_LOSS"
                        checked={formData.orderType === "STOP_LOSS"}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Stop Loss
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="orderType"
                        value="STOP_LIMIT"
                        checked={formData.orderType === "STOP_LIMIT"}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Stop Limit
                    </label>
                  </div>
                </div>

                {/* Limit Price (appears only for Limit or Stop Limit orders) */}
                {["LIMIT", "STOP_LIMIT"].includes(formData.orderType) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">
                      Limit Price
                    </label>
                    <input
                      type="number"
                      name="limitPrice"
                      value={formData.limitPrice}
                      onChange={handleChange}
                      placeholder="Enter limit price"
                      className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
                    />
                  </div>
                )}

                {/* Stop Price (appears only for Stop Loss or Stop Limit orders) */}
                {["STOP_LOSS", "STOP_LIMIT"].includes(formData.orderType) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">
                      Stop Price
                    </label>
                    <input
                      type="number"
                      name="stopPrice"
                      value={formData.stopPrice}
                      onChange={handleChange}
                      placeholder="Enter stop price"
                      className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full mt-1 border border-gray-800 bg-[#3A6FF8] rounded-lg p-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-[#235CEF] bg-white border rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm text-white rounded-lg ${
                      isBuy
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? "Placing Order..." : isBuy ? "Buy" : "Sell"}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Show error message if there's an issue */}
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      <YesNoConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
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
          onClose();
        }}
        title="Order Placed Successfully"
        message={`Successfully placed order for ${formData.stockSymbol}`}
        onConfirm={() => {
          setShowSuccessModal(false);
          onSubmit(formData);
          onClose();
        }}
      />
    </>
  );
};

export default PlaceOrderModal;
