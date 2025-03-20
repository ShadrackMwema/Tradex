// hooks/useCoinDeduction.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deductUserCoins, refreshUserInfo } from '../../redux/actions/user';

export const useCoinDeduction = (user, isAuthenticated) => {
  const [isDeductionConfirmed, setIsDeductionConfirmed] = useState(false);
  const [coinDeductionAmount, setCoinDeductionAmount] = useState(0);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const dispatch = useDispatch();

  // Calculate random coin deduction based on product price
  const calculateCoinDeduction = (price) => {
    if (!price) return 0;
    
    // Base deduction is 1-5% of the price, converted to whole number
    const basePercentage = Math.random() * 4 + 1; // 1-5%
    const baseDeduction = Math.ceil((price * basePercentage) / 100);
    
    // Add some randomness but keep it reasonable
    const randomFactor = Math.random() * 0.5 + 0.75; // 0.75-1.25
    const finalDeduction = Math.max(1, Math.round(baseDeduction * randomFactor));
    
    // Cap the maximum deduction
    return Math.min(finalDeduction, 10);
  };

  // Show confirmation prompt
  const showDeductionPrompt = (price) => {
    if (!isAuthenticated) {
      toast.error("Please login to view product details");
      return false;
    }
    
    const deduction = calculateCoinDeduction(price);
    setCoinDeductionAmount(deduction);
    setIsPromptOpen(true);
    return true;
  };

  // Handle user confirmation
  const confirmDeduction = async (userId) => {
    try {
      console.log("Dispatching deductUserCoins...");
      await dispatch(deductUserCoins(userId, coinDeductionAmount));
  
      console.log("Dispatching refreshUserInfo...");
      await dispatch(refreshUserInfo());
  
      setIsDeductionConfirmed(true);
      setIsPromptOpen(false);
      toast.success(`${coinDeductionAmount} coins deducted successfully`);
      return true;
    } catch (error) {
      toast.error("Error deducting coins");
      setIsPromptOpen(false);
      return false;
    }
  };
  // Handle user rejection
  const rejectDeduction = () => {
    setIsPromptOpen(false);
    return false;
  };

  return {
    isDeductionConfirmed,
    coinDeductionAmount,
    isPromptOpen,
    showDeductionPrompt,
    confirmDeduction,
    rejectDeduction
  };
};

export default useCoinDeduction;