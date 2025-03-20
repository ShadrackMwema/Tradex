import React from "react";
import { FaCoins } from "react-icons/fa";
import styles from "../../styles/styles";

const CoinDeductionPrompt = ({ isOpen, coinAmount, onConfirm, onReject, userCoins }) => {
  if (!isOpen) return null;

  const hasEnoughCoins = userCoins >= coinAmount;
  const newBalance = userCoins - coinAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl transform transition-all duration-300 scale-95 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <FaCoins className="text-yellow-500 text-4xl mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Confirm Deduction</h2>
        </div>

        {/* Cost Info */}
        <p className="mb-4 text-center text-gray-600">
          Viewing this product will cost{" "}
          <span className="font-bold text-teal-600">{coinAmount} coins</span>.
        </p>

        {/* Balance Details */}
        <div className="bg-gray-100 rounded-xl p-4 shadow-inner">
          <div className="flex justify-between items-center text-gray-700">
            <span>Your balance:</span>
            <span className="font-bold flex items-center text-gray-900">
              <FaCoins className="text-yellow-500 mr-1" />
              {userCoins}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2 text-gray-700">
            <span>Cost:</span>
            <span className="font-bold text-red-500 flex items-center">
              <FaCoins className="text-yellow-500 mr-1" />
              -{coinAmount}
            </span>
          </div>

          {hasEnoughCoins && (
            <div className="border-t mt-2 pt-2 flex justify-between items-center text-gray-700">
              <span>New balance:</span>
              <span className="font-bold flex items-center text-gray-900">
                <FaCoins className="text-yellow-500 mr-1" />
                {newBalance}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {!hasEnoughCoins && (
          <p className="text-red-500 text-center font-medium mt-4">
            You don’t have enough coins to view this product.
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            onClick={onReject}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} !rounded-lg !h-11 ${
              !hasEnoughCoins ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-transform"
            }`}
            onClick={onConfirm}
            disabled={!hasEnoughCoins}
          >
            <span className="text-white">Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinDeductionPrompt;
