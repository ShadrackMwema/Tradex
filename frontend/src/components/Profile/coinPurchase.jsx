import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BiCoin } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51PzH3cRuoJCqKJ0b81NcVmJGu8U7diRMzXUCwOYYGYRa1VhwqYJZp6SijVeNbFNz3gz3Bajh1AoZrshqt7k4rYob00kWTkkq1q");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  },
  hidePostalCode: true
};

const CheckoutForm = ({ selectedPackage, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !selectedPackage) {
      return;
    }

    setLoading(true);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send to your server
      const response = await axios.post(
        `${server}/coins/purchase`,
        {
          amount: selectedPackage.id,
          paymentMethodId: paymentMethod.id,
        },
        {
          withCredentials: true,
        }
      );

      onSuccess(response.data);
      dispatch(loadUser());
    } catch (error) {
      console.error("Error:", error);
      onError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-5 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Card Details
        </label>
        <div className="border-b border-gray-200 pb-3 mb-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="flex items-center justify-end text-xs text-gray-500">
          <img src="/api/placeholder/60/20" alt="Stripe" className="h-5 mr-2" />
          Secure payment processing by Stripe
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        disabled={!stripe || loading || !selectedPackage}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${selectedPackage?.price || 0}`
        )}
      </button>
    </form>
  );
};

const CoinPurchaseCard = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const coinPackages = [
    { id: "small", coins: 100, price: 5, popular: false },
    { id: "medium", coins: 300, price: 12, popular: true },
    { id: "large", coins: 500, price: 18, popular: false },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleSuccess = (data) => {
    setMessage(`Success! New balance: ${data.newBalance} coins`);
    setMessageType('success');
    setSelectedPackage(null);
  };

  const handleError = (error) => {
    setMessage(`Purchase failed: ${error}`);
    setMessageType('error');
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <div className="bg-white p-6 md:p-8 shadow-xl rounded-2xl border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <BiCoin className="text-yellow-500 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Buy Coins</h2>
        </div>
        
        {isAuthenticated && user?.coins !== undefined && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-600">Current Balance</p>
            <div className="flex items-center justify-center">
              <BiCoin className="text-yellow-500 text-xl mr-1" />
              <span className="text-2xl font-bold text-gray-800">{user.coins} coins</span>
            </div>
          </div>
        )}
        
        {message && (
          <div 
            className={`mb-6 p-4 rounded-xl flex items-center ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {messageType === 'success' ? (
              <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Select a Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 relative ${
                selectedPackage?.id === pkg.id
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
              }`}
              onClick={() => {
                setSelectedPackage(pkg);
                setMessage(null); // Clear previous messages
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex items-center mb-2">
                <BiCoin className="text-yellow-500 text-xl mr-1" />
                <h3 className="text-lg font-bold">{pkg.coins}</h3>
              </div>
              <p className="text-gray-800 font-medium">${pkg.price}</p>
              <p className="text-xs text-gray-500 mt-1">
                ${(pkg.price / pkg.coins * 100).toFixed(2)} per 100 coins
              </p>
            </div>
          ))}
        </div>
        
        {isAuthenticated ? (
          <div>
            {selectedPackage ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  selectedPackage={selectedPackage} 
                  onSuccess={handleSuccess} 
                  onError={handleError}
                />
              </Elements>
            ) : (
              <p className="text-center text-gray-500 py-3 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                Select a package to continue
              </p>
            )}
          </div>
        ) : (
          <button
            className="w-full mt-4 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            onClick={() => alert("Please login to continue")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Login to Purchase
          </button>
        )}
        
        <p className="text-xs text-gray-500 text-center mt-6">
          By purchasing coins, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default CoinPurchaseCard;