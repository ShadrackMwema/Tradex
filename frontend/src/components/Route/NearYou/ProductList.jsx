import React from "react";

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.discountPrice}</p>
            <p>Location: {product.sellerLocation}</p>
          </div>
        ))
      ) : (
        <p>No products found for this location.</p>
      )}
    </div>
  );
};

export default ProductList;