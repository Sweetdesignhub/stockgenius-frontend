import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config";
import { ToggleRight, ToggleLeft } from "lucide-react";

const PlaceOrderModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    stockSymbol: initialData?.symbol || "", // Stock symbol pre-filled
    action: "BUY",
    orderType: "MARKET", // Default order type
    quantity: "",
    limitPrice: "",
    stopPrice: "",
    exchange: "NSE", // Default exchange
    productType: "CNC", // Default product type
  });

  const { currentUser } = useSelector((state) => state.user);

  const [isQuickOrder, setIsQuickOrder] = useState(false); // Toggle state for quick vs regular order
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error state

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        stockSymbol: initialData.symbol || "",
        action: initialData.action || "BUY", // Set the action based on initialData
      }));
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true
    setError(""); // Clear any previous error

    try {
      const response = await api.post(
        `/api/v1/paper-trading/orders/place/${currentUser.id}`,
        formData
      );
      console.log(response);

      if (response.status === 201) {
        // Handle success (you can call onSubmit if needed)
        onSubmit(formData);
        onClose(); // Close the modal on success
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("Error placing order: " + err.message);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  if (!isOpen) return null;

  const isBuy = formData.action === "BUY";
  const actionColor = isBuy ? "blue" : "red";

  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  //     <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
  //       {/* Modal Header */}
  //       <div
  //         className={`px-6 py-4 flex items-center justify-between border-b ${
  //           isBuy ? "bg-blue-500" : "bg-red-500"
  //         } text-white`}
  //       >
  //         <div className="flex items-center">
  //           <span className="text-lg font-semibold mr-4">
  //             {formData.stockSymbol}
  //           </span>
  //           <button
  //             onClick={handleActionToggle}
  //             className={`px-4 py-1 text-sm rounded-full border border-white text-white ${
  //               isBuy
  //                 ? "border-blue-500 hover:text-blue-500 hover:bg-blue-100"
  //                 : "border-red-500 hover:text-red-500 hover:bg-red-100"
  //             }`}
  //           >
  //             {isBuy ? "Switch to Sell" : "Switch to Buy"}
  //           </button>
  //         </div>
  //         <button
  //           onClick={onClose}
  //           className="text-white hover:text-gray-200 focus:outline-none"
  //         >
  //           ✕
  //         </button>
  //       </div>

  //       {/* Order Type Toggle Buttons: Quick vs Regular */}
  //       <div className="flex gap-2 p-4 border-t">
  //         <button
  //           onClick={() => handleOrderTypeToggle("quick")}
  //           className={`px-4 py-1 text-sm rounded-full border ${
  //             isQuickOrder
  //               ? "border-blue-500 text-blue-500 bg-blue-100"
  //               : "border-gray-500 text-gray-500 hover:bg-gray-100"
  //           }`}
  //         >
  //           Quick Order
  //         </button>
  //         <button
  //           onClick={() => handleOrderTypeToggle("regular")}
  //           className={`px-4 py-1 text-sm rounded-full border ${
  //             !isQuickOrder
  //               ? "border-blue-500 text-blue-500 bg-blue-100"
  //               : "border-gray-500 text-gray-500 hover:bg-gray-100"
  //           }`}
  //         >
  //           Regular Order
  //         </button>
  //       </div>

  //       {/* Modal Form */}
  //       <form onSubmit={handleSubmit} className="p-6">
  //         {/* Exchange (NSE/BSE) */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium text-gray-700">
  //             Exchange
  //           </label>
  //           <div className="flex gap-4 mt-1 text-black">
  //             <label className="flex items-center">
  //               <input
  //                 type="radio"
  //                 name="exchange"
  //                 value="NSE"
  //                 checked={formData.exchange === "NSE"}
  //                 onChange={handleChange}
  //                 className="mr-2"
  //               />
  //               NSE
  //             </label>
  //             <label className="flex items-center">
  //               <input
  //                 type="radio"
  //                 name="exchange"
  //                 value="BSE"
  //                 checked={formData.exchange === "BSE"}
  //                 onChange={handleChange}
  //                 className="mr-2"
  //               />
  //               BSE
  //             </label>
  //           </div>
  //         </div>

  //         {/* Product Type (Intraday / CNC) */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium text-gray-700">
  //             Product Type
  //           </label>
  //           <div className="flex gap-4 mt-1 text-black">
  //             <label className="flex items-center">
  //               <input
  //                 type="radio"
  //                 name="productType"
  //                 value="INTRADAY"
  //                 checked={formData.productType === "INTRADAY"}
  //                 onChange={handleChange}
  //                 className="mr-2"
  //               />
  //               Intraday
  //             </label>
  //             <label className="flex items-center">
  //               <input
  //                 type="radio"
  //                 name="productType"
  //                 value="CNC"
  //                 checked={formData.productType === "CNC"}
  //                 onChange={handleChange}
  //                 className="mr-2"
  //               />
  //               CNC
  //             </label>
  //           </div>
  //         </div>

  //         {/* Quick Order Mode: Show only Quantity and Buy/Cancel */}
  //         {isQuickOrder ? (
  //           <>
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 Quantity
  //               </label>
  //               <input
  //                 type="number"
  //                 name="quantity"
  //                 value={formData.quantity}
  //                 onChange={handleChange}
  //                 placeholder="Enter quantity"
  //                 className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
  //               />
  //             </div>

  //             <div className="flex justify-end gap-4">
  //               <button
  //                 type="button"
  //                 onClick={onClose}
  //                 className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 type="submit"
  //                 className={`px-4 py-2 text-sm text-white rounded-lg ${
  //                   isBuy
  //                     ? "bg-blue-500 hover:bg-blue-600"
  //                     : "bg-red-500 hover:bg-red-600"
  //                 }`}
  //                 disabled={loading} // Disable button while loading
  //               >
  //                 {loading
  //                   ? "Placing Order..."
  //                   : isBuy
  //                   ? "Place Buy Order"
  //                   : "Place Sell Order"}
  //               </button>
  //             </div>
  //           </>
  //         ) : (
  //           // Regular Order Mode: Show all the fields
  //           <>
  //             {/* Order Type */}
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 Order Type
  //               </label>
  //               <select
  //                 name="orderType"
  //                 value={formData.orderType}
  //                 onChange={handleChange}
  //                 className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
  //               >
  //                 <option value="MARKET">Market</option>
  //                 <option value="LIMIT">Limit</option>
  //                 <option value="STOP_LOSS">Stop Loss</option>
  //                 <option value="STOP_LIMIT">Stop Limit</option>
  //               </select>
  //             </div>

  //             {/* Limit Price (appears only for Limit or Stop Limit orders) */}
  //             {["LIMIT", "STOP_LIMIT"].includes(formData.orderType) && (
  //               <div className="mb-4">
  //                 <label className="block text-sm font-medium text-gray-700">
  //                   Limit Price
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="limitPrice"
  //                   value={formData.limitPrice}
  //                   onChange={handleChange}
  //                   placeholder="Enter limit price"
  //                   className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
  //                 />
  //               </div>
  //             )}

  //             {/* Stop Price (appears only for Stop Loss or Stop Limit orders) */}
  //             {["STOP_LOSS", "STOP_LIMIT"].includes(formData.orderType) && (
  //               <div className="mb-4">
  //                 <label className="block text-sm font-medium text-gray-700">
  //                   Stop Price
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="stopPrice"
  //                   value={formData.stopPrice}
  //                   onChange={handleChange}
  //                   placeholder="Enter stop price"
  //                   className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
  //                 />
  //               </div>
  //             )}

  //             {/* Quantity */}
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 Quantity
  //               </label>
  //               <input
  //                 type="number"
  //                 name="quantity"
  //                 value={formData.quantity}
  //                 onChange={handleChange}
  //                 placeholder="Enter quantity"
  //                 className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black"
  //               />
  //             </div>

  //             <div className="flex justify-end gap-4">
  //               <button
  //                 type="button"
  //                 onClick={onClose}
  //                 className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 type="submit"
  //                 className={`px-4 py-2 text-sm text-white rounded-lg ${
  //                   isBuy
  //                     ? "bg-blue-500 hover:bg-blue-600"
  //                     : "bg-red-500 hover:bg-red-600"
  //                 }`}
  //                 disabled={loading} // Disable button while loading
  //               >
  //                 {loading
  //                   ? "Placing Order..."
  //                   : isBuy
  //                   ? "Place Buy Order"
  //                   : "Place Sell Order"}
  //               </button>
  //             </div>
  //           </>
  //         )}
  //       </form>

  //       {/* Show error message if there's an issue */}
  //       {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default PlaceOrderModal;
