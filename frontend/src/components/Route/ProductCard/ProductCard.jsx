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
  const [isHovered, setIsHovered] = useState(false);
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

  const discountPercentage = data.originalPrice && data.discountPrice
    ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="w-full rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {discountPercentage}% OFF
        </div>
      )}

      <div className={`absolute top-3 right-3 z-20 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>  
        {click ? (
          <button 
            className="p-2 rounded-full shadow-md bg-transparent"
            onClick={() => removeFromWishlistHandler(data)}
            title="Remove from wishlist"
          >
            <AiFillHeart size={20} className="text-red-500" />
          </button>
        ) : (
          <button 
            className="p-2 rounded-full shadow-md bg-transparent"
            onClick={() => addToWishlistHandler(data)}
            title="Add to wishlist"
          >
            <AiOutlineHeart size={20} className="text-gray-600 hover:text-red-500" />
          </button>
        )}
      </div>

      <div className="relative overflow-hidden h-52">
        <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`} className="block w-full h-full">
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-10' : ''}`}></div>
        </Link>
        {data.stock < 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/shop/preview/${data?.shop._id}`}> 
          <h5 className="text-xs text-gray-500 hover:text-blue-500 transition-colors">{data.shop.name}</h5>
        </Link>
        <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <h4 className="text-base font-medium text-gray-800 mt-1 hover:text-blue-600 transition-colors line-clamp-2 h-12">
            {data.name}
          </h4>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <Ratings rating={data?.ratings} />
          <span className="text-xs text-green-600 font-medium">{data?.sold_out} sold</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <h5 className="text-lg font-bold text-gray-900">Ksh {data.discountPrice || data.originalPrice}</h5>
          {data.originalPrice && data.discountPrice && (
            <h4 className="text-sm text-gray-500 line-through mb-0.5">Ksh {data.originalPrice}</h4>
          )}
        </div>
      </div>

      <div className={`absolute bottom-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>  
        <button 
          className="p-2 rounded-full shadow-md bg-transparent"
          onClick={() => setOpen(!open)}
          title="Quick view"
        >
          <AiOutlineEye size={20} className="text-gray-700" />
        </button>
        <button 
          className={`p-2 rounded-full shadow-md transition-all ${data.stock < 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={() => data.stock >= 1 && addToCartHandler(data._id)}
          disabled={data.stock < 1}
          title={data.stock < 1 ? "Out of stock" : "Add to cart"}
        >
          <AiOutlineShoppingCart size={20} className={data.stock < 1 ? 'text-gray-500' : 'text-white'} />
        </button>
      </div>
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
};

export default ProductCard;
  