import React, { useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";

const AutoTradeModal = ({ isOpen, onClose, onCreateBot }) => {
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

  const handleCreateBot = async () => {
    if (!validateInput()) return;

    if (formData.botAccess === "Yes") {
      const botData = {
        name: formData.botName,
        profitPercentage: parseFloat(formData.marginProfitPercentage),
        riskPercentage: parseFloat(formData.marginLossPercentage),
        productType: formData.productType,
      };

      onCreateBot(botData);
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
                Create Bot
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
                onClick={handleCreateBot}
                className="rounded-lg py-2 px-4 text-sm text-white bg-[#235CEF]"
              >
                Create
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




// const Card = ({ imageSrc, value, description, valueColor }) => {
//   return (
//     <div className="flex items-center justify-center border border-[#00000012] shadow rounded-lg px-2 py-4 flex-1">
//       <div className="mr-1">
//         <img loading="lazy" src={imageSrc} alt="icon" className="w-6 h-6" />
//       </div>
//       <div className="flex flex-col">
//         <p className="text-[13px]" style={{ color: valueColor }}>
//           {value}
//         </p>
//         <p className="text-[10px] text-[#030229]">{description}</p>
//       </div>
//     </div>
//   );
// };

// const cardData = [
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F369e05e6515b47da97509b147d5221bf",
//     value: "10000",
//     description: "Capital Required",
//     valueColor: "#0F0AF4",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F3d792fc678664d9abf93f22d36e3aa0c",
//     value: "Not Recorded",
//     description: "Hit Ratio",
//     valueColor: "#0EBC34",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F5c5ae447ffaf4119857892309e5f70e3",
//     value: "0.00%",
//     description: "Risk",
//     valueColor: "#FF0000",
//   },
// ];

{
  /* <div className="px-5 py-3 text-black rounded-bl-lg rounded-br-lg">
          <div className="flex space-x-4">
            {cardData.map((card, index) => (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                value={card.value}
                description={card.description}
                valueColor={card.valueColor}
              />
            ))}
          </div>

          <div className="py-3">
            <h2 className="text-sm font-bold py-2">Select Accounts</h2>
            <select className="w-full p-2 border rounded bg-[#F7F7F8]">
              <option value="">Account dropdown</option>
           
            </select>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">Select Risk Profile</h2>
              <div className="flex py-2">
                <div className="p-2 mr-2 rounded-sm font-semibold text-sm bg-[#F36B6B] text-[#2B1F0366]">
                  Low
                </div>
                <div className="p-2 mr-2 rounded-sm font-semibold text-sm bg-[#FDE89F] text-[#2B1F0366]">
                  Medium
                </div>
                <div className="p-2 mr-2 rounded-sm font-semibold text-sm bg-[#0EBC34] text-[#FFFFFF]">
                  High
                </div>
              </div>
              <p className="text-[10px] font-semibold text-[#1459DE]">
                Risk upto 3%
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold">Enter lots</h2>
              <div className="flex py-2">
                <input
                  type="text"
                  className="border border-[#41414166] rounded-sm py-1 px-2 bg-[#F7F7F8]"
                />
              </div>
              <p className="text-[10px] font-semibold text-[#1459DE]">
                Total amount: 1 x 10000
              </p>
            </div>
          </div>

          <div className="py-3">
            <h2 className="text-sm font-bold">
              Enter auto-trades execution time range
            </h2>

            <div className="flex py-2 items-center">
              <input
              placeholder="Enter start date"
                className="border  px-4 rounded-sm py-1 bg-[#F7F7F8] mr-2"
                type="date"
              />
              <p className="mr-2">to</p> 
              <input
               placeholder="Enter end date"
                className="border px-4 rounded-sm py-1 bg-[#F7F7F8]"
                type="date"
              />
            </div>
          </div>

          <div className="py-6 flex items-center justify-center">
            <button
              onClick={onClose}
              className="rounded-lg py-2 px-4 text-sm border text-[#235CEF] bg-[white] mr-2"
            >
              Cancel
            </button>
            <button className="rounded-lg py-2 px-4 text-sm border text-white bg-[#235CEF] ">
              Activate
            </button>
          </div>
        </div> */
}
