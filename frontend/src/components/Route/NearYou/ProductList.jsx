import React from "react";
import ProductCard from "../ProductCard/ProductCard";

const ProductList = ({ products }) => {
  console.log("Products received in ProductList:", products);

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <h1 className="text-2xl font-semibold text-gray-700">
          No products found!
        </h1>
        <p className="text-gray-500 mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Products Near You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <ProductCard data={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;