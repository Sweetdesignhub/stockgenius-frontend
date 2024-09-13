// SessionExpiredModal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react'; // Assuming you're using @headlessui for modal

const SessionExpiredModal = ({ showModal, onSignOut }) => {
  if (!showModal) return null;

  return (
    <Dialog open={showModal} onClose={() => {}}>
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm mx-auto bg-white px-5 py-5 rounded-xl shadow-lg">
          <Dialog.Title className="text-lg text-center font-bold text-black">Session Expired</Dialog.Title>
          <Dialog.Description className="mt-2 text-black">
            Your session has expired. Please sign in again.
          </Dialog.Description>
          <div className="mt-4 flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded text-center"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SessionExpiredModal;
