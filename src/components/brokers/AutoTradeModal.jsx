// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import ConfirmationModal from "../common/ConfirmationModal";
// import api from "../../config";

// const AutoTradeModal = ({ isOpen, onClose, onActivate, isActivatingBot }) => {
//   const [marginProfitPercentage, setMarginProfitPercentage] = useState("");
//   const [marginLossPercentage, setMarginLossPercentage] = useState("");
//   const [botAccess, setBotAccess] = useState("Yes");
//   const [productType, setProductType] = useState(""); 
//   const [profitError, setProfitError] = useState("");
//   const [lossError, setLossError] = useState("");
//   const [confirmationOpen, setConfirmationOpen] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState("");

//   console.log(productType);
  

//   const { currentUser } = useSelector((state) => state.user);
//   const fyersAccessToken = useSelector((state) => state.fyers);
//   // console.log(currentUser);
//   if (!isOpen) return null;

//   const activateAutoTradeBot = async () => {
//     try {
//       // const response = await api.post(
//       //   `/api/v1/users/auto-trade-bot-INTRADAY/activate/${currentUser.id}`,
//       //   {
//       //     marginProfitPercentage,
//       //     marginLossPercentage,
//       //   }
//       // );
//       const endpoint =
//         productType === "INTRADAY"
//           ? `/api/v1/users/auto-trade-bot-INTRADAY/activate/${currentUser.id}`
//           : `/api/v1/users/auto-trade-bot-CNC/activate/${currentUser.id}`;

//       const response = await api.post(endpoint, {
//         marginProfitPercentage,
//         marginLossPercentage,
//       });
//       if (response.status === 200) {
//         setConfirmationMessage(
//           isActivatingBot
//             ? "Bot activated successfully!"
//             : "Auto Trade Bot activated successfully!"
//         );
//         onActivate(true, {
//           marginProfitPercentage,
//           marginLossPercentage,
//         });
//       } else {
//         setConfirmationMessage("Failed to activate the bot. Please try again.");
//       }
//     } catch (error) {
//       setConfirmationMessage("An error occurred. Please try again.");
//     }
//     setConfirmationOpen(true);
//   };

//   const handleActivate = () => {
//     let valid = true;

//     if (!marginProfitPercentage) {
//       setProfitError("Please enter profit percentage.");
//       valid = false;
//     } else if (
//       isNaN(marginProfitPercentage) ||
//       marginProfitPercentage < 5 ||
//       marginProfitPercentage > 50
//     ) {
//       setProfitError("Profit percentage must be a number between 5 and 50.");
//       valid = false;
//     } else {
//       setProfitError("");
//     }

//     if (!marginLossPercentage) {
//       setLossError("Please enter loss percentage.");
//       valid = false;
//     } else if (
//       isNaN(marginLossPercentage) ||
//       marginLossPercentage < 0.1 ||
//       marginLossPercentage > 50
//     ) {
//       setLossError("Loss percentage must be a number between 0.1 and 50.");
//       valid = false;
//     } else {
//       setLossError("");
//     }

//     if (valid) {
//       if (botAccess === "Yes") {
//         activateAutoTradeBot();
//       } else {
//         setConfirmationMessage(
//           "Please set bot access to Yes to start the auto trade bot."
//         );
//         setConfirmationOpen(true);
//       }
//     }
//   };

//   const handleConfirmationClose = () => {
//     setConfirmationOpen(false);
//     if (confirmationMessage === "Congratulations! Your bot is activated.") {
//       onClose();
//     }
//     onClose();
//   };

//   return (
//     <>
//       <div
//         className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50"
//         role="dialog"
//         aria-modal="true"
//       >
//         <div className="w-full max-w-lg mx-4 md:mx-auto shadow-lg relative bg-white rounded-lg">
//           <div className="auto-popup px-5 py-3 rounded-tl-lg rounded-tr-lg relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-3 cursor-pointer text-3xl text-gray-300 hover:text-gray-400"
//               aria-label="Close modal"
//             >
//               &times;
//             </button>
//             <div>
//               <h2 className="text-xl text-white font-poppins font-semibold">
//                 {isActivatingBot ? "Activate Bot" : "Activate Auto Trade Bot"}
//               </h2>
//               <p className="text-sm text-gray-300">NSE | EQ | INTRADAY</p>
//             </div>
//             <div className="flex flex-col gap-3 py-3">
//               <div className="flex flex-row gap-3 items-center justify-between">
//                 <div className="flex flex-col w-1/2">
//                   <label htmlFor="profit-percentage" className="text-white">
//                     Profit Percentage
//                   </label>
//                   <input
//                     type="text"
//                     id="profit-percentage"
//                     value={marginProfitPercentage}
//                     onChange={(e) => setMarginProfitPercentage(e.target.value)}
//                     className="rounded-lg py-2 px-4 mt-1 text-black"
//                   />
//                   {profitError && (
//                     <p className="text-red-500 text-sm mt-1">{profitError}</p>
//                   )}
//                 </div>
//                 <div className="flex flex-col w-1/2">
//                   <label htmlFor="loss-percentage" className="text-white">
//                     Loss Percentage
//                   </label>
//                   <input
//                     type="text"
//                     id="loss-percentage"
//                     value={marginLossPercentage}
//                     onChange={(e) => setMarginLossPercentage(e.target.value)}
//                     className="rounded-lg py-2 px-4 mt-1 text-black"
//                   />
//                   {lossError && (
//                     <p className="text-red-500 text-sm mt-1">{lossError}</p>
//                   )}
//                 </div>
//               </div>

//               {/* New Product Type field */}
//               <div className="flex flex-col gap-3 py-3">
//                 <label htmlFor="product-type" className="text-white">
//                   Product Type
//                 </label>
//                 <select
//                   id="product-type"
//                   value={productType}
//                   onChange={(e) => setProductType(e.target.value)}
//                   className="rounded-lg py-2 px-4 mt-1 text-black"
//                 >
//                   <option value="">Select Product Type</option>
//                   <option value="INTRADAY">INTRADAY</option>
//                   <option value="CNC">CNC</option>
//                 </select>
//               </div>

//               <div className="flex flex-col gap-3 py-3">
//                 <label htmlFor="bot-access" className="text-white">
//                   Bot Access
//                 </label>
//                 <select
//                   id="bot-access"
//                   value={botAccess}
//                   onChange={(e) => setBotAccess(e.target.value)}
//                   className="rounded-lg py-2 px-4 mt-1 text-black"
//                 >
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//                 <p className="text-white text-sm mt-1">
//                   To activate the bot, it is necessary to select Yes.
//                 </p>
//               </div>
//             </div>
//             <div className="py-6 flex items-center justify-center">
//               <button
//                 onClick={onClose}
//                 className="rounded-lg py-2 px-4 text-sm text-[#235CEF] bg-[white] mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleActivate}
//                 className="rounded-lg py-2 px-4 text-sm text-white bg-[#235CEF]"
//               >
//                 Activate
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={confirmationOpen}
//         onClose={handleConfirmationClose}
//         title="Bot Activation"
//         message={confirmationMessage}
//         onConfirm={handleConfirmationClose}
//       />
//     </>
//   );
// };

// export default AutoTradeModal;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import ConfirmationModal from "../common/ConfirmationModal";
import api from "../../config";

const AutoTradeModal = ({ isOpen, onClose, onActivate, isActivatingBot }) => {
  const [marginProfitPercentage, setMarginProfitPercentage] = useState("");
  const [marginLossPercentage, setMarginLossPercentage] = useState("");
  const [botAccess, setBotAccess] = useState("Yes");
  const [productType, setProductType] = useState(""); 
  const [profitError, setProfitError] = useState("");
  const [lossError, setLossError] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  console.log(productType);
  

  const { currentUser } = useSelector((state) => state.user);
  const fyersAccessToken = useSelector((state) => state.fyers);
  // console.log(currentUser);
  if (!isOpen) return null;

  const activateAutoTradeBot = async () => {
    try {
      // const response = await api.post(
      //   `/api/v1/users/auto-trade-bot-INTRADAY/activate/${currentUser.id}`,
      //   {
      //     marginProfitPercentage,
      //     marginLossPercentage,
      //   }
      // );
      const endpoint =
        productType === "INTRADAY"
          ? `/api/v1/users/auto-trade-bot-INTRADAY/activate/${currentUser.id}`
          : `/api/v1/users/auto-trade-bot-CNC/activate/${currentUser.id}`;

      const response = await api.post(endpoint, {
        marginProfitPercentage,
        marginLossPercentage,
      });
      if (response.status === 200) {
        setConfirmationMessage(
          isActivatingBot
            ? "Bot activated successfully!"
            : "Auto Trade Bot activated successfully!"
        );
        onActivate(true, {
          marginProfitPercentage,
          marginLossPercentage,
        });
      } else {
        setConfirmationMessage("Failed to activate the bot. Please try again.");
      }
    } catch (error) {
      setConfirmationMessage("An error occurred. Please try again.");
    }
    setConfirmationOpen(true);
  };

  const handleActivate = () => {
    let valid = true;

    if (!marginProfitPercentage) {
      setProfitError("Please enter profit percentage.");
      valid = false;
    } else if (
      isNaN(marginProfitPercentage) ||
      marginProfitPercentage < 5 ||
      marginProfitPercentage > 50
    ) {
      setProfitError("Profit percentage must be a number between 5 and 50.");
      valid = false;
    } else {
      setProfitError("");
    }

    if (!marginLossPercentage) {
      setLossError("Please enter loss percentage.");
      valid = false;
    } else if (
      isNaN(marginLossPercentage) ||
      marginLossPercentage < 0.1 ||
      marginLossPercentage > 50
    ) {
      setLossError("Loss percentage must be a number between 0.1 and 50.");
      valid = false;
    } else {
      setLossError("");
    }

    if (valid) {
      if (botAccess === "Yes") {
        activateAutoTradeBot();
      } else {
        setConfirmationMessage(
          "Please set bot access to Yes to start the auto trade bot."
        );
        setConfirmationOpen(true);
      }
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    if (confirmationMessage === "Congratulations! Your bot is activated.") {
      onClose();
    }
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
                {isActivatingBot ? "Activate Bot" : "Activate Auto Trade Bot"}
              </h2>
              <p className="text-sm text-gray-300">NSE | EQ | INTRADAY</p>
            </div>
            <div className="flex flex-col gap-3 py-3">
              <div className="flex flex-row gap-3 items-center justify-between">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="profit-percentage" className="text-white">
                    Profit Percentage
                  </label>
                  <input
                    type="text"
                    id="profit-percentage"
                    value={marginProfitPercentage}
                    onChange={(e) => setMarginProfitPercentage(e.target.value)}
                    className="rounded-lg py-2 px-4 mt-1 text-black"
                  />
                  {profitError && (
                    <p className="text-red-500 text-sm mt-1">{profitError}</p>
                  )}
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="loss-percentage" className="text-white">
                    Loss Percentage
                  </label>
                  <input
                    type="text"
                    id="loss-percentage"
                    value={marginLossPercentage}
                    onChange={(e) => setMarginLossPercentage(e.target.value)}
                    className="rounded-lg py-2 px-4 mt-1 text-black"
                  />
                  {lossError && (
                    <p className="text-red-500 text-sm mt-1">{lossError}</p>
                  )}
                </div>
              </div>

              {/* New Product Type field */}
              <div className="flex flex-col gap-3 py-3">
                <label htmlFor="product-type" className="text-white">
                  Product Type
                </label>
                <select
                  id="product-type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="rounded-lg py-2 px-4 mt-1 text-black"
                >
                  <option value="">Select Product Type</option>
                  <option value="INTRADAY">INTRADAY</option>
                  <option value="CNC">CNC</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 py-3">
                <label htmlFor="bot-access" className="text-white">
                  Bot Access
                </label>
                <select
                  id="bot-access"
                  value={botAccess}
                  onChange={(e) => setBotAccess(e.target.value)}
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
                onClick={handleActivate}
                className="rounded-lg py-2 px-4 text-sm text-white bg-[#235CEF]"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={handleConfirmationClose}
        title="Bot Activation"
        message={confirmationMessage}
        onConfirm={handleConfirmationClose}
      />
    </>
  );
};

export default AutoTradeModal;



