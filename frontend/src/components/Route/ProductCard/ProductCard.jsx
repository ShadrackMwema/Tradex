import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 relative cursor-pointer">
      {/* Wishlist Icon */}
      <div className="absolute top-4 right-4 z-10">
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer text-red-500"
            onClick={() => removeFromWishlistHandler(data)}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer text-gray-600 hover:text-red-500"
            onClick={() => addToWishlistHandler(data)}
            title="Add to wishlist"
          />
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
      >
        <img
          src={data.images && data.images[0]?.url}
          alt={data.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>

      {/* Shop Name */}
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <h5 className="text-sm text-gray-600 mt-2 hover:text-blue-500">
          {data.shop.name}
        </h5>
      </Link>

      {/* Product Name */}
      <Link
        to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
      >
        <h4 className="text-lg font-semibold text-gray-800 mt-2 hover:text-blue-500">
          {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
        </h4>
      </Link>

      {/* Ratings */}
      <div className="mt-2">
        <Ratings rating={data?.ratings} />
      </div>

      {/* Price and Sold Count */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h5 className="text-lg font-bold text-gray-900">
            ${data.discountPrice || data.originalPrice}
          </h5>
          {data.originalPrice && (
            <h4 className="text-sm text-gray-500 line-through">
              ${data.originalPrice}
            </h4>
          )}
        </div>
        <span className="text-sm text-green-600">{data?.sold_out} sold</span>
      </div>

      {/* Quick View and Add to Cart Icons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3">
        <AiOutlineEye
          size={22}
          className="cursor-pointer text-gray-600 hover:text-blue-500"
          onClick={() => setOpen(!open)}
          title="Quick view"
        />
        <AiOutlineShoppingCart
          size={22}
          className="cursor-pointer text-gray-600 hover:text-blue-500"
          onClick={() => addToCartHandler(data._id)}
          title="Add to cart"
        />
      </div>

      {/* Product Details Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
};

export default ProductCard;