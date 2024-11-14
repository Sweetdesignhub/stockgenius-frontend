/**
 * File: Modal
 * Description: 
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "./Input";

export default function Modal({
  isOpen,
  closeModal,
  placeOrder,
  rowData,
  actionType,
  quantity,
  productType,
  handleQuantityChange,
  handleInputChange,
  handleProductTypeChange,
}) {
  if (!rowData) return null;

  const [selectedOption, setSelectedOption] = useState("");
  const fyersAccessToken =
    useSelector((state) => state.fyers) ||
    localStorage.getItem("fyers_access_token");
  const zerodhaAccessToken =
    useSelector((state) => state.zerodha) ||
    localStorage.getItem("zerodha_access_token");

  // Automatically set selectedOption based on the available access token
  useEffect(() => {
    if (fyersAccessToken) {
      setSelectedOption("Fyers");
    } else if (zerodhaAccessToken) {
      setSelectedOption("Zerodha");
    } else {
      setSelectedOption(""); // Reset if neither access token is present
    }
  }, [fyersAccessToken, zerodhaAccessToken]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/5 p-6 text-left align-middle shadow-xl transition-all backdrop-blur-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {actionType === "buy"
                    ? "Buy Confirmation"
                    : "Sell Confirmation"}
                </Dialog.Title>
                <div className="mt-2 text-white">
                  <p className="text-sm text-white/50">
                    Are you sure you want to {actionType} the following item?
                  </p>
                  <div className="flex flex-col gap-4 mt-4">
                    {/* <Dropdown
                      selectedOption={selectedOption}
                      handleOptionSelect={handleOptionSelect}
                    /> */}
                    <div className="text-center text-3xl font-bold">
                    {fyersAccessToken ? (
                      <div>Fyers</div>
                    ) : zerodhaAccessToken ? (
                      <div>Zerodha</div>
                    ) : (
                      <div>No broker selected</div> // Optional: Message when no broker is selected
                    )}
                    </div>
                    <Input
                      label="Company Name"
                      name="Company Name"
                      type="text"
                      value={rowData["Company Name"]}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Ticker"
                      name="Ticker"
                      type="text"
                      value={rowData["Ticker"]}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                    />

                    {/* Product Type Dropdown */}
                    <div className="flex flex-col">
                      <label className="text-white">Product Type</label>
                      <select
                        name="productType"
                        value={productType}
                        onChange={handleProductTypeChange} // Handler for product type selection
                        className="mt-1 p-2 rounded text-black"
                      >
                        <option value="CNC">CNC (Delivery)</option>
                        <option value="INTRADAY">MIS (Intraday)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end items-center gap-4">
                  {/* Buy/Sell Button */}
                  <button
                    className={`inline-flex py-[9px] justify-center items-center rounded-md border border-transparent px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
                      actionType === "buy"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-red-600 hover:bg-red-500"
                    }`}
                    onClick={placeOrder}
                  >
                    {actionType === "buy" ? "BUY" : "SELL"}
                  </button>

                  {/* Cancel Button */}
                  <button
                    className="inline-flex py-[9px] justify-center items-center rounded-md border border-transparent bg-gray-700 px-4 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
