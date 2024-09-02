import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const YesNoConfirmationModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
}) => {
  const customActions = (close) => (
    <div className="flex justify-center space-x-4">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md bg-[#3A6FF8] py-1.5 px-3 text-sm/6 text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-600"
        onClick={() => {
          onConfirm();
          close();
        }}
      >
        Yes
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 text-gray-700 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-300"
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
    />
  );
};

export default YesNoConfirmationModal;
