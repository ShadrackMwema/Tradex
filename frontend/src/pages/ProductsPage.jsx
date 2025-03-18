import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import BottomTaskbar from "../components/Layout/BottomTaskbar";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  // List of locations (ensure these match the sellerLocation values in the database)
  const locations = [
    "All Locations",
    "nairobi",
    "kisumu",
    "mombasa",
    "nakuru",
    "eldoret",
  ];

  useEffect(() => {
    console.log("All Products:", allProducts); // Log all products
    console.log("Selected Location:", selectedLocation); // Log selected location

    let filteredProducts = allProducts;

    // Filter by category
    if (categoryData) {
      filteredProducts = filteredProducts.filter(
        (i) => i.category === categoryData
      );
    }

    // Filter by location (case-insensitive)
    if (selectedLocation && selectedLocation !== "All Locations") {
      filteredProducts = filteredProducts.filter(
        (i) => i.sellerLocation.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    console.log("Filtered Products:", filteredProducts); // Log filtered products
    setData(filteredProducts);
  }, [allProducts, categoryData, selectedLocation]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
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
              {/* Location Filter */}
              <div className="mb-6">
                <label htmlFor="location" className="font-medium text-gray-700">
                  Location:
                </label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="ml-2 p-2 border border-gray-300 rounded-md"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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