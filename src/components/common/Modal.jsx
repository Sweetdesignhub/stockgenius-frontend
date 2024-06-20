import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Input from "./Input";
import Dropdown from "../dashboard/Dropdown";
import FyersBuyButton from "../FyersBuyButton";

export default function Modal({
  isOpen,
  closeModal,
  rowData,
  actionType,
  quantity,
  handleQuantityChange,
  handleInputChange,
}) {
  if (!rowData) return null;
  const [selectedOption, setSelectedOption] = useState("");

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
                    <Dropdown
                      selectedOption={selectedOption}
                      handleOptionSelect={handleOptionSelect}
                    />
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
                  </div>
                </div>
                {/* <button
                    className="inline-flex justify-center rounded-md border border-transparent  py-2 px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                    onClick={handleConfirm}
                  > */}
                {/* {actionType === "buy" ? "Confirm Buy" : "Confirm Sell"} */}
                <div className="mt-4 flex justify-end items-center">
                  {selectedOption === "Fyers" && (
                    <div className="mr-3">
                      <FyersBuyButton
                        apiKey="SH4XR0GZIF-100"
                        symbol={`NSE:${rowData["Ticker"]}-EQ`}
                        product="INTRADAY"
                        quantity={quantity}
                        orderType="MARKET"
                        price={101}
                        transactionType={actionType === "buy" ? "BUY" : "SELL"}
                      />
                    </div>
                  )}
                  <button
                    className="inline-flex py-[9px] justify-center items-center rounded-md border border-transparent bg-gray-700  px-4 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
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
