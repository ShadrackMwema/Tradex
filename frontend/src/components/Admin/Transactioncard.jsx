import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { FiCreditCard, FiDollarSign, FiPackage, FiInfo, FiCheck, FiClock, FiXCircle } from "react-icons/fi";
import TransactionGraphs from './transactionGraph';
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

  // Status icon component
  const StatusIcon = ({ status }) => {
    if (status === "completed") return <FiCheck className="text-green-500" />;
    if (status === "pending") return <FiClock className="text-yellow-500" />;
    return <FiXCircle className="text-red-500" />;
  };

  // Get appropriate icon for transaction field
  const getFieldIcon = (field) => {
    switch (field) {
      case "type": return <FiInfo className="text-blue-500" />;
      case "amount": return <FiDollarSign className="text-indigo-500" />;
      case "paymentAmount": return <FiDollarSign className="text-purple-500" />;
      case "paymentId": return <FiCreditCard className="text-gray-500" />;
      case "packageType": return <FiPackage className="text-orange-500" />;
      default: return <FiInfo className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
           <TransactionGraphs transactions={transactions} />
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                <div className="h-2 bg-gray-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiXCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Transaction History
        </h2>
        <button 
          onClick={fetchTransactions} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((transaction, index) => (
          <div
            key={transaction._id || index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Transaction #{index + 1}
                </h3>
                <div className="flex items-center">
                  <StatusIcon status={transaction?.status} />
                  <span className="ml-2 text-white text-sm capitalize">
                    {transaction?.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <div className="flex items-center">
                    {getFieldIcon("type")}
                    <span className="ml-2 text-sm font-medium text-gray-500">Type</span>
                  </div>
                  <div className="mt-1 text-gray-900 font-medium">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {transaction?.type || "N/A"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    {getFieldIcon("amount")}
                    <span className="ml-2 text-sm font-medium text-gray-500">Amount</span>
                  </div>
                  <div className="mt-1 text-gray-900 font-semibold">
                    {transaction?.amount || 0} coins
                  </div>
                </div>

                {transaction?.paymentAmount && (
                  <div>
                    <div className="flex items-center">
                      {getFieldIcon("paymentAmount")}
                      <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
                    </div>
                    <div className="mt-1 text-gray-900 font-semibold">
                      ${transaction.paymentAmount}
                    </div>
                  </div>
                )}

                {transaction?.paymentId && (
                  <div className="col-span-2">
                    <div className="flex items-center">
                      {getFieldIcon("paymentId")}
                      <span className="ml-2 text-sm font-medium text-gray-500">Payment ID</span>
                    </div>
                    <div className="mt-1 text-gray-600 text-sm truncate">
                      {transaction.paymentId}
                    </div>
                  </div>
                )}

                {transaction?.packageType && (
                  <div className="col-span-2">
                    <div className="flex items-center">
                      {getFieldIcon("packageType")}
                      <span className="ml-2 text-sm font-medium text-gray-500">Package</span>
                    </div>
                    <div className="mt-1 text-gray-900">
                      {transaction.packageType}
                    </div>
                  </div>
                )}
              </div>

              {transaction?.description && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <FiInfo className="text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-500">Description</span>
                  </div>
                  <p className="mt-1 text-gray-600 text-sm">
                    {transaction.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 text-right">
              <span className="text-xs text-gray-500">
                {transaction.createdAt 
                  ? new Date(transaction.createdAt).toLocaleDateString() 
                  : "No date available"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {transactions.length > 6 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;