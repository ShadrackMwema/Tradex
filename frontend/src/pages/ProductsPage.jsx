import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import BottomTaskbar from "../components/Layout/BottomTaskbar";
import LocationFilter from "../components/Layout/LocationFilter"; // Import the LocationFilter component
import { getAllProducts } from "../redux/actions/product"; // Import the action

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, locations, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Filter products based on the selected location and category
  useEffect(() => {
    let filteredProducts = allProducts || [];

    // Filter by category
    if (categoryData) {
      filteredProducts = filteredProducts.filter(
        (i) => i.category === categoryData
      );
    }

    // Filter by location (case-insensitive)
    if (selectedLocation && selectedLocation !== "All Locations") {
      filteredProducts = filteredProducts.filter((i) => {
        if (!i.sellerLocation) {
          console.warn(`Product ${i.name} has no sellerLocation`);
          return false;
        }
        return i.sellerLocation.toLowerCase() === selectedLocation.toLowerCase();
      });
    }

    setData(filteredProducts);
  }, [allProducts, categoryData, selectedLocation]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    console.log("Selected Location Updated:", location);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Header activeHeading={3} />
          <main className="flex-grow p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Location Filter Component */}
              <div className="mb-6">
                <LocationFilter
                  selectedLocation={selectedLocation}
                  onLocationChange={handleLocationChange}
                  locations={locations || ["All Locations"]}
                />
              </div>

              {/* Product Grid - Updated for 2 columns on mobile, 6 on desktop */}
              <div className="grid grid-cols-2 xs:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                {data && data.length > 0 ? (
                  data.map((product, index) => (
                    <ProductCard data={product} key={index} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <h1 className="text-2xl font-semibold text-gray-700">
                      No products found!
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
          <BottomTaskbar />
        </div>
      )}
    </>
  );
};

export default ProductsPage;