// components/Layout/CoinIndicator.js
import React from 'react';
import { useSelector } from 'react-redux';
import { FaCoins } from 'react-icons/fa';

const CoinIndicator = () => {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    console.log("CoinIndicator re-render, coins:", user.coins); // Log the coin balance
    if (!isAuthenticated) return null;
    return (
      <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
        <FaCoins className="text-yellow-500 mr-2" />
        <span className="font-medium text-black500-">{user.coins || 0}</span>
      </div>
    );
  };
export default CoinIndicator;

// Add this to your Header component:
// import CoinIndicator from './CoinIndicator';
// 
// And then in your Header's JSX:
// <div className="flex items-center">
//   <CoinIndicator />
//   {/* Other header items */}
// </div>