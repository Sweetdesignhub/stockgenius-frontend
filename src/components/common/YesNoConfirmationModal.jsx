// /**
//  * File: YesNoConfirmationModal
//  * Description: This component is a customized confirmation modal for yes/no user interactions. It provides a tailored prompt using a reusable `ConfirmationModal` component, displaying "Yes" and "No" buttons to confirm or dismiss an action. The modal receives a message, title, and callback functions as props for customizable and dynamic usage across different scenarios. Styled with Tailwind CSS for a consistent look and feel.
//  *
//  * Developed by: Arshdeep Singh
//  * Developed on: 2024-11-14
//  *
//  * Updated by: [Name]
//  * Updated on: [Update date]
//  * - Update description: Brief description of what was updated or fixed
//  */

// import React from "react";
// import ConfirmationModal from "./ConfirmationModal";

// const YesNoConfirmationModal = ({
//   isOpen,
//   onClose,
//   title,
//   message,
//   onConfirm,
// }) => {
//   const customActions = (close) => (
//     <div className="flex justify-center space-x-4">
//       <button
//         type="button"
//         className="inline-flex items-center gap-2 rounded-md bg-[#3A6FF8] py-1.5 px-3 text-sm/6 text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-600"
//         onClick={() => {
//           onConfirm();
//           close();
//         }}
//       >
//         Yes
//       </button>
//       <button
//         type="button"
//         className="inline-flex items-center gap-2 rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 text-gray-700 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-300"
//         onClick={close}
//       >
//         No
//       </button>
//     </div>
//   );

//   return (
//     <ConfirmationModal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={title}
//       message={<div dangerouslySetInnerHTML={{ __html: message }} />}
//       customActions={customActions}
//     />
//   );
// };

// export default YesNoConfirmationModal;

import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const YesNoConfirmationModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isPlaceOrder,
  action,
}) => {
  const getActionButtonStyles = () => {
    if (!isPlaceOrder) {
      return "bg-[#3A6FF8] text-white";
    }

    // Specific styles for PlaceOrderModal
    return action === "BUY"
      ? "bg-white text-green-500 hover:bg-gray-50"
      : "bg-white text-red-500 hover:bg-gray-50";
  };

  const getButtonText = () => {
    if (!isPlaceOrder) return "Yes";
    return action;
  };

  const customActions = (close) => (
    <div className="flex justify-center space-x-4">
      {/* Primary Action Button (Buy/Sell or Yes) */}
      <button
        type="button"
        className={`inline-flex items-center gap-2 rounded-md font-bold py-1.5 px-3 text-sm/6 shadow-inner border border-gray-200 focus:outline-none ${getActionButtonStyles()}`}
        onClick={() => {
          onConfirm();
          close();
        }}
      >
        {getButtonText()}
      </button>

      {/* No/Cancel Button */}
      <button
        type="button"
        className={`inline-flex items-center gap-2 rounded-md font-bold py-1.5 px-3 text-sm/6 shadow-inner focus:outline-none ${
          isPlaceOrder
            ? "bg-[#605BFF] text-white hover:bg-[#4d49cc]"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={close}
      >
        No
      </button>
    </div>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={<div dangerouslySetInnerHTML={{ __html: message }} />}
      customActions={customActions}
      isPlaceOrder={isPlaceOrder}
    />
  );
};

export default YesNoConfirmationModal;
