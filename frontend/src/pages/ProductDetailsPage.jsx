// ProductDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useCoinDeduction } from "../components/Products/useCoinDeduction";
import CoinDeductionPrompt from "../components/Products/fee";
import Loader from "../components/Layout/Loader";
import {Grid} from "@material-ui/core"
const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedDeduction, setHasCheckedDeduction] = useState(false);

  // Initialize coin deduction hook
  const {
    isDeductionConfirmed,
    coinDeductionAmount,
    isPromptOpen,
    showDeductionPrompt,
    confirmDeduction,
    rejectDeduction
  } = useCoinDeduction(user, isAuthenticated);

  useEffect(() => {
    let productData;
    
    if (eventData !== null) {
      productData = allEvents && allEvents.find((i) => i._id === id);
    } else {
      productData = allProducts && allProducts.find((i) => i._id === id);
    }
    
    if (productData) {
      setData(productData);
      setIsLoading(false);
      
      // Only show deduction prompt if not already checked and user is authenticated
      if (!hasCheckedDeduction && isAuthenticated) {
        const price = productData.discountPrice || productData.originalPrice || 0;
        showDeductionPrompt(price);
        setHasCheckedDeduction(true);
      }
    }
  }, [allProducts, allEvents, id, eventData, isAuthenticated, hasCheckedDeduction]);

  const handleConfirmDeduction = async () => {
    if (await confirmDeduction(user._id)) {
      // Coin deduction is now handled by the Redux action
      // No need to manually update user.coins here
    }
  };

  const handleRejectDeduction = () => {
    rejectDeduction();
    // Navigate back to products page
    navigate('/products');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      {isDeductionConfirmed || !isAuthenticated ? (
        <>
        <Grid size="6">

          <ProductDetails data={data} />
        </Grid>
          {!eventData && (
            <>
              {data && <SuggestedProduct data={data} />}
            </>
          )}
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <CoinDeductionPrompt
            isOpen={isPromptOpen}
            coinAmount={coinDeductionAmount}
            onConfirm={handleConfirmDeduction}
            onReject={handleRejectDeduction}
            userCoins={user?.coins || 0}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;