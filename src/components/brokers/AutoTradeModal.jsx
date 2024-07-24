import React from "react";
import { useSelector } from "react-redux";

const Card = ({ imageSrc, value, description, valueColor }) => {
  return (
    <div className="flex items-center justify-center border border-[#00000012] shadow rounded-lg px-2 py-4 flex-1">
      <div className="mr-1">
        <img loading="lazy" src={imageSrc} alt="icon" />
      </div>
      <div className="flex flex-col">
        <p className="text-[13px]" style={{ color: valueColor }}>
          {value}
        </p>
        <p className="text-[10px] text-[#030229]">{description}</p>
      </div>
    </div>
  );
};

const cardData = [
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F369e05e6515b47da97509b147d5221bf",
    value: "10000",
    description: "Capital Required",
    valueColor: "#0F0AF4",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F3d792fc678664d9abf93f22d36e3aa0c",
    value: "Not Recorded",
    description: "Hit Ratio",
    valueColor: "#0EBC34",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F5c5ae447ffaf4119857892309e5f70e3",
    value: "0.00%",
    description: "Risk",
    valueColor: "#FF0000",
  },
];

const AutoTradeModal = ({ isOpen, onClose }) => {
  const fyersAccessToken = useSelector((state) => state.fyers);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-lg mx-4 md:mx-auto shadow-lg relative">
        <div className="bg-[#3A6FF8] px-5 py-3 rounded-tl-lg rounded-tr-lg">
          <button
            onClick={onClose}
            className="absolute top-0 right-3 cursor-pointer text-3xl text-gray-300 hover:text-gray-400"
          >
            &times;
          </button>
          <div>
            <h2 className="text-xl text-white font-poppins font-semibold">
              Enter Details
            </h2>
            <p className="text-sm text-gray-300">NSE | EQ | INTRADAY</p>
          </div>
        </div>
        <div className="bg-white px-5 py-3 text-black rounded-bl-lg rounded-br-lg">
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
            <h2 className="text-md font-bold">Select Accounts</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTradeModal;
