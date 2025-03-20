import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data?.shop._id));
    setClick(wishlist?.some((i) => i._id === data?._id));
  }, [data, wishlist, dispatch]);

  const toggleWishlist = () => {
    setClick(!click);
    dispatch(click ? removeFromWishlist(data) : addToWishlist(data));
  };

  const addToCartHandler = () => {
    if (cart?.some((i) => i._id === data._id)) {
      toast.error("Item already in cart!");
      return;
    }
    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: count }));
    toast.success("Item added to cart!");
  };

  const handleMessageSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the seller");
      return;
    }
    try {
      const res = await axios.post(`${server}/conversation/create-new-conversation`, {
        groupTitle: `${data._id}${user._id}`,
        userId: user._id,
        sellerId: data.shop._id,
      });
      navigate(`/inbox?${res.data.conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating conversation");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img src={data.images[select]?.url} alt={data.name} className="w-full rounded-lg" />
            <div className="flex space-x-2 mt-2">
              {data.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className={`w-16 h-16 object-cover rounded cursor-pointer ${select === index ? 'border-2 border-teal-500' : ''}`}
                  onClick={() => setSelect(index)}
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
            <p className="text-gray-600 mt-2">{data.description}</p>
            <div className="flex items-center space-x-4 mt-4">
              <span className="text-xl font-bold text-teal-600">${data.discountPrice}</span>
              {data.originalPrice && (
                <span className="text-gray-500 line-through">${data.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center mt-6 space-x-2">
              <button className="px-3 py-1 bg-teal-500 text-white rounded" onClick={() => setCount(count > 1 ? count - 1 : 1)}>-</button>
              <span className="px-4 py-1 bg-gray-200 rounded">{count}</span>
              <button className="px-3 py-1 bg-teal-500 text-white rounded" onClick={() => setCount(count + 1)}>+</button>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <button className="bg-teal-600 text-white px-4 py-2 rounded flex items-center space-x-2" onClick={addToCartHandler}>
                <AiOutlineShoppingCart /> <span>Add to Cart</span>
              </button>
              <button className="text-red-500" onClick={toggleWishlist}>
                {click ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
              </button>
            </div>
            <button className="mt-6 bg-purple-600 text-white px-4 py-2 rounded flex items-center space-x-2" onClick={handleMessageSubmit}>
              <AiOutlineMessage /> <span>Message Seller</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
