/**
 * File: SessionExpiredModal
 * Description: A modal component to inform users that their session has expired. The dialog box is centered on the screen on which user will click to Signout.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React from "react";
import { Dialog } from "@headlessui/react";

const SessionExpiredModal = ({ showModal, onSignOut }) => {
  if (!showModal) return null;

  return (
    <Dialog open={showModal} onClose={() => {}}>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-20"
        aria-hidden="true"
      />
      <div className="fixed z-30 inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm mx-auto bg-white px-5 py-5 rounded-xl shadow-lg">
          <Dialog.Title className="text-lg text-center font-bold text-black">
            Session Expired
          </Dialog.Title>
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
