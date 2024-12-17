import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">Are you sure?</h2>
        <p className="text-center text-gray-300 mb-4">
          You already have generated wallets. Generating new mnemonics will reset the wallets.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Yes, Generate New
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;