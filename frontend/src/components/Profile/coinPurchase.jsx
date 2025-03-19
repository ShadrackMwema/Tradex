import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4 p-4 border border-gray-300 rounded-md bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border-b border-gray-300 pb-2 mb-2">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500">
          Secure payment processing by Stripe
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!stripe || loading || !selectedPackage}
      >
        {loading ? "Processing..." : `Pay $${selectedPackage?.price || 0}`}
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
    { id: "small", coins: 100, price: 5 },
    { id: "medium", coins: 300, price: 12 },
    { id: "large", coins: 500, price: 18 },
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
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-semibold">Buy Coins</h2>
        {isAuthenticated && user?.coins !== undefined && (
          <p className="text-center text-gray-600 mt-1">
            Current Balance: {user.coins} coins
          </p>
        )}
        
        {message && (
          <div 
            className={`mt-4 p-3 rounded ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setSelectedPackage(pkg);
                setMessage(null); // Clear previous messages
              }}
            >
              <h3 className="text-lg font-medium">{pkg.coins} Coins</h3>
              <p className="text-gray-600">${pkg.price}</p>
            </div>
          ))}
        </div>
        
        {isAuthenticated ? (
          <div className="mt-4">
            {selectedPackage ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  selectedPackage={selectedPackage} 
                  onSuccess={handleSuccess} 
                  onError={handleError}
                />
              </Elements>
            ) : (
              <p className="text-center text-gray-500 mt-2">
                Select a package to continue
              </p>
            )}
          </div>
        ) : (
          <button
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => alert("Please login to continue")}
          >
            Login to Purchase
          </button>
        )}
      </div>
    </div>
  );
};

export default CoinPurchaseCard;