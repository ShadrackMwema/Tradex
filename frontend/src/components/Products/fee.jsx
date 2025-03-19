import React from "react";

const FeeConfirmationModal = ({ onConfirm, onCancel, fee }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Fee</h2>
        <p className="mb-4">
          You will be charged <span className="font-bold">{fee.toFixed(2)} coins</span> to
          view this product. Do you agree?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeConfirmationModal;