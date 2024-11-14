import React, { useEffect, useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";

const AutoTradeModal = ({
  isOpen,
  onClose,
  onCreateBot,
  onUpdateBot,
  botData,
}) => {
  const [formData, setFormData] = useState({
    botName: "",
    marginProfitPercentage: "",
    marginLossPercentage: "",
    botAccess: "Yes",
    productType: "",
  });

  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill form fields if botData is provided (for editing)
  useEffect(() => {
    if (botData) {
      setFormData({
        botName: botData.name || "",
        marginProfitPercentage: botData.profitPercentage || "",
        marginLossPercentage: botData.riskPercentage || "",
        botAccess: botData.botAccess || "Yes",
        productType: botData.productType || "",
      });
    } else {
      // Clear the form when no botData is provided (for creating)
      setFormData({
        botName: "",
        marginProfitPercentage: "",
        marginLossPercentage: "",
        botAccess: "Yes",
        productType: "",
      });
    }
  }, [botData]);

  if (!isOpen) return null;

  const validateInput = () => {
    const newErrors = {};

    if (!formData.marginProfitPercentage) {
      newErrors.marginProfitPercentage = "Profit percentage is required.";
    } else if (
      isNaN(formData.marginProfitPercentage) ||
      formData.marginProfitPercentage < 0.1 ||
      formData.marginProfitPercentage > 50
    ) {
      newErrors.marginProfitPercentage =
        "Profit percentage must be a number between 0.1 and 50.";
    }

    if (!formData.marginLossPercentage) {
      newErrors.marginLossPercentage = "Loss percentage is required.";
    } else if (
      isNaN(formData.marginLossPercentage) ||
      formData.marginLossPercentage < 0.1 ||
      formData.marginLossPercentage > 50
    ) {
      newErrors.marginLossPercentage =
        "Loss percentage must be a number between 0.1 and 50.";
    }

    if (!formData.botName) {
      newErrors.botName = "Bot name is required.";
    }

    if (!formData.productType) {
      newErrors.productType = "Product type is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    if (formData.botAccess === "Yes") {
      const botPayload = {
        name: formData.botName,
        profitPercentage: parseFloat(formData.marginProfitPercentage),
        riskPercentage: parseFloat(formData.marginLossPercentage),
        productType: formData.productType,
      };

      try {
        if (botData) {
          // If botData exists, update the bot
          await onUpdateBot(botData._id, botPayload); //  bot ID for updating
        } else {
          // Otherwise, create a new bot
          await onCreateBot(botPayload);
        }

        // Clear the form fields after successful submission
        setFormData({
          botName: "",
          marginProfitPercentage: "",
          marginLossPercentage: "",
          botAccess: "Yes",
          productType: "",
        });

        onClose();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setMessage(error.response.data.message);
        } else {
          setMessage("An error occurred. Please try again.");
        }
        setConfirmationOpen(true);
      }
    } else {
      setMessage("Please set bot access to Yes to start the auto trade bot.");
      setConfirmationOpen(true);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-lg mx-4 md:mx-auto shadow-lg relative bg-white rounded-lg">
          <div className="auto-popup px-5 py-3 rounded-tl-lg rounded-tr-lg relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 cursor-pointer text-3xl text-gray-300 hover:text-gray-400"
              aria-label="Close modal"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl text-white font-poppins font-semibold">
                {botData ? "Update" : "Create"} Bot
              </h2>
              <p className="text-sm text-gray-300">NSE | EQ | INTRADAY</p>
            </div>
            <div className="flex flex-col gap-3 py-3">
              <div className="flex flex-col gap-3 py-3">
                <label htmlFor="botName" className="text-white">
                  Bot Name
                </label>
                <input
                  type="text"
                  id="botName"
                  name="botName"
                  value={formData.botName}
                  onChange={handleChange}
                  className="rounded-lg py-2 px-4 mt-1 text-black"
                  placeholder="Enter Bot Name"
                />
                {errors.botName && (
                  <p className="text-red-500 text-sm mt-1">{errors.botName}</p>
                )}
              </div>
              <div className="flex flex-row gap-3 items-center justify-between">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="marginProfitPercentage"
                    className="text-white"
                  >
                    Profit Percentage
                  </label>
                  <input
                    type="text"
                    id="marginProfitPercentage"
                    name="marginProfitPercentage"
                    value={formData.marginProfitPercentage}
                    onChange={handleChange}
                    className="rounded-lg py-2 px-4 mt-1 text-black"
                  />
                  {errors.marginProfitPercentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.marginProfitPercentage}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="marginLossPercentage" className="text-white">
                    Loss Percentage
                  </label>
                  <input
                    type="text"
                    id="marginLossPercentage"
                    name="marginLossPercentage"
                    value={formData.marginLossPercentage}
                    onChange={handleChange}
                    className="rounded-lg py-2 px-4 mt-1 text-black"
                  />
                  {errors.marginLossPercentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.marginLossPercentage}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 py-3">
                <label htmlFor="productType" className="text-white">
                  Product Type
                </label>
                <select
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="rounded-lg py-2 px-4 mt-1 text-black"
                >
                  <option value="">Select Product Type</option>
                  <option value="INTRADAY">INTRADAY</option>
                  <option value="CNC">CNC</option>
                </select>
                {errors.productType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productType}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 py-3">
                <label htmlFor="botAccess" className="text-white">
                  Bot Access
                </label>
                <select
                  id="botAccess"
                  name="botAccess"
                  value={formData.botAccess}
                  onChange={handleChange}
                  className="rounded-lg py-2 px-4 mt-1 text-black"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <p className="text-white text-sm mt-1">
                  To activate the bot, it is necessary to select Yes.
                </p>
              </div>
            </div>
            <div className="py-6 flex items-center justify-center">
              <button
                onClick={onClose}
                className="rounded-lg py-2 px-4 text-sm text-[#235CEF] bg-[white] mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg py-2 px-4 text-sm text-white bg-[#235CEF]"
              >
                {botData ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={handleConfirmationClose}
          title="Error"
          message={message}
          onConfirm={handleConfirmationClose}
        />
      )}
    </>
  );
};

export default AutoTradeModal;



