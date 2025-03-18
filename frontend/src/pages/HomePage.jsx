import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Footer from "../components/Layout/Footer";
import BottomTaskbar from "../components/Layout/BottomTaskbar";
import ProductList from "../components/Route/NearYou/ProductList";
import LocationFilter from "../components/Layout/LocationFilter";
import { getAllProducts } from "../redux/actions/product"; // Import the action

const HomePage = () => {
  const dispatch = useDispatch();
  const { allProducts, locations, isLoading } = useSelector((state) => state.products);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Filter products based on the selected location
  const filteredProducts =
    selectedLocation === "All Locations"
      ? allProducts || []
      : (allProducts || []).filter((product) => {
          if (!product.sellerLocation) {
            return false;
          }
          return (
            product.sellerLocation.toLowerCase() === selectedLocation.toLowerCase()
          );
        });

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    console.log("Selected Location Updated:", location);
  };

  return (
    <div>
      <Header activeHeading={1} />
      <div className="mb-8">
        <Hero />
      </div>
      <div className="flex justify-center items-center my-6">
  <LocationFilter
    selectedLocation={selectedLocation}
    onLocationChange={handleLocationChange}
    locations={locations || ["All Locations"]}
  />
</div>

      <Categories />
      {isLoading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Footer />
      <BottomTaskbar />
    </div>
  );
};

export default HomePage;