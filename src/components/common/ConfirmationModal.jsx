// /**
//  * File: ConfirmationModal
//  * Description:This component is a reusable modal that displays a confirmation message to the user. It is typically used to prompt users for confirmation actions (e.g., "Are you sure?" or "Proceed with the action?"). The modal can show a custom title, message, and confirmation button. Optionally, it can also accept custom actions (such as custom buttons or additional functionality) through the `customActions` prop. The modal is built using `@headlessui/react`'s `Dialog` component and is styled using Tailwind CSS. The component includes smooth animations and support for closing the modal with a button click.
//  *
//  * Developed by: Arshdeep Singh
//  * Developed on: 2024-11-14
//  *
//  * Updated by: [Name]
//  * Updated on: [Update date]
//  * - Update description: Brief description of what was updated or fixed
//  */

import { Dialog } from "@headlessui/react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  customActions,
  isPlaceOrder,
}) => {
  return (
    <Dialog
      open={Boolean(isOpen)}
      as="div"
      className="relative z-10"
      onClose={onClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <Dialog.Panel
          className={`w-full max-w-sm rounded-xl p-8 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 ${
            isPlaceOrder ? "bg-[#3A6FF8]" : "bg-white"
          }`}
        >
          <Dialog.Title
            as="h3"
            className={`text-lg font-[inter] font-medium text-center ${
              isPlaceOrder ? "text-white" : "text-black"
            }`}
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <div
              className={`text-sm/6 text-center ${
                isPlaceOrder ? "text-white" : "text-[#03030399]"
              }`}
            >
              {message}
            </div>
          </div>
          <div className="mt-4 text-center">
            {customActions ? (
              customActions(() => onClose())
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-[#3A6FF8] py-1.5 px-3 text-sm/6 text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={onConfirm}
              >
                Got it thanks
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
