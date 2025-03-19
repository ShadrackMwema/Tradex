import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";

const TransactionCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${server}/coins/transactions`, {
        withCredentials: true,
      });

      const data = response.data.transactions;
      console.log(data);

      // Ensure transactions is always an array
      setTransactions(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {transactions.length > 1 ? "Transaction History" : "Transaction Details"}
      </h2>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={transaction._id || index}
            className="shadow-md rounded-lg p-4 bg-white border border-gray-200"
          >
            <div className="pb-2 border-b border-gray-300">
              <h3 className="text-lg font-medium text-gray-800">
                {transactions.length > 1 ? `Transaction ${index + 1}` : "Transaction"}
              </h3>
            </div>
            <div className="mt-3 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md">
                  {transaction?.type || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="text-gray-900 font-semibold">
                  {transaction?.amount || 0} coins
                </span>
              </div>
              {transaction?.paymentAmount && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <span className="text-gray-900 font-semibold">
                    ${transaction.paymentAmount}
                  </span>
                </div>
              )}
              {transaction?.paymentId && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment ID:</span>
                  <span className="truncate max-w-[150px] text-gray-600">
                    {transaction.paymentId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-3 py-1 rounded-md ${
                    transaction?.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : transaction?.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction?.status || "Unknown"}
                </span>
              </div>
              {transaction?.packageType && (
                <div className="flex justify-between">
                  <span className="font-medium">Package:</span>
                  <span className="text-gray-900 font-semibold">
                    {transaction.packageType}
                  </span>
                </div>
              )}
              {transaction?.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-600 text-sm mt-1">
                    {transaction.description}
                  </p>
                </div>
              )}
              {transaction?.metadata && (
                <div>
                  <span className="font-medium">Metadata:</span>
                  <p className="text-gray-600 text-sm mt-1">
                    {JSON.stringify(transaction.metadata)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCard;
