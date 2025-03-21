import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const TransactionGraphs = ({ transactions = [] }) => {
  const [timeframeData, setTimeframeData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [activeView, setActiveView] = useState('monthly');

  useEffect(() => {
    if (transactions.length === 0) return;
    
    // Process data for time-based visualization
    processTimeData();
    
    // Process data for transaction types
    processTypeData();
    
    // Process data for status distribution
    processStatusData();
  }, [transactions, activeView]);

  const processTimeData = () => {
    // Group transactions by month/week/day based on activeView
    const groupedData = {};
    
    transactions.forEach(transaction => {
      if (!transaction.createdAt) return;
      
      let timeKey;
      const date = new Date(transaction.createdAt);
      
      if (activeView === 'monthly') {
        timeKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (activeView === 'weekly') {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        timeKey = `Week ${weekNum}`;
      } else {
        timeKey = date.toLocaleDateString();
      }
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          name: timeKey,
          amount: 0,
          count: 0
        };
      }
      
      groupedData[timeKey].amount += Number(transaction.amount) || 0;
      groupedData[timeKey].count += 1;
    });
    
    // Convert to array and sort chronologically
    const result = Object.values(groupedData).sort((a, b) => {
      if (activeView === 'monthly') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    setTimeframeData(result);
  };

  const processTypeData = () => {
    const typeCount = {};
    
    transactions.forEach(transaction => {
      const type = transaction.type || 'unknown';
      if (!typeCount[type]) {
        typeCount[type] = {
          name: type,
          value: 0
        };
      }
      typeCount[type].value += 1;
    });
    
    setTypeData(Object.values(typeCount));
  };

  const processStatusData = () => {
    const statusCount = {};
    
    transactions.forEach(transaction => {
      const status = transaction.status || 'unknown';
      if (!statusCount[status]) {
        statusCount[status] = {
          name: status,
          value: 0
        };
      }
      statusCount[status].value += 1;
    });
    
    setStatusData(Object.values(statusCount));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">No transaction data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction Analytics</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveView('daily')}
            className={`px-3 py-1 text-sm rounded-md ${activeView === 'daily' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setActiveView('weekly')}
            className={`px-3 py-1 text-sm rounded-md ${activeView === 'weekly' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setActiveView('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${activeView === 'monthly' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Over Time */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeframeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" name="Number of Transactions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Transaction Amount Over Time */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Transaction Amount</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeframeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Total Coins" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Transaction by Type */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Transaction Types</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Transaction by Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Transaction Status</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionGraphs;