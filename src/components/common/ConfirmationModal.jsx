import { Dialog } from "@headlessui/react";

const ConfirmationModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  return (
    <Dialog
      open={Boolean(isOpen)}
      as="div"
      className="relative z-10"
      onClose={onClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-8 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
          <Dialog.Title as="h3" className="text-lg font-[inter] font-medium text-center text-black">
            {title}
          </Dialog.Title>
          <div className="">
            <p className="text-sm/6 text-[#03030399] text-center">{message}</p>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-[#3A6FF8] py-1.5 px-3 text-sm/6  text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
              onClick={onConfirm}
            >
              Got it thanks
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
