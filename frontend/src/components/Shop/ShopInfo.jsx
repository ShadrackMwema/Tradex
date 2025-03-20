import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { FaStar, FaMapMarkerAlt, FaPhone, FaBox, FaCalendarAlt } from "react-icons/fa";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);
  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );
  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Shop Header with Avatar and Name */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
            <div className="absolute left-0 w-full flex flex-col items-center pb-4 -mt-16">
              <img
                src={`${data.avatar?.url}`}
                alt={data.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
              <h3 className="text-xl font-bold mt-4 text-gray-800">{data.name}</h3>
              <div className="flex items-center mt-1 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-gray-700 font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">{totalReviewsLength} reviews</span>
              </div>
            </div>
          </div>

          {/* Shop Description */}
          <div className="px-6 pt-20 mt-4 pb-6">
            <p className="text-gray-600 text-center italic">
              "{data.description || ""}"
            </p>
          </div>

          {/* Shop Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-1">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <h5 className="font-semibold text-gray-700">Address</h5>
              </div>
              <p className="text-gray-600 ml-6">{data.address || "Not provided"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-1">
                <FaPhone className="text-gray-500 mr-2" />
                <h5 className="font-semibold text-gray-700">Phone Number</h5>
              </div>
              <p className="text-gray-600 ml-6">{data.phoneNumber || "Not provided"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-1">
                <FaBox className="text-gray-500 mr-2" />
                <h5 className="font-semibold text-gray-700">Total Products</h5>
              </div>
              <p className="text-gray-600 ml-6">{products && products.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-1">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <h5 className="font-semibold text-gray-700">Joined On</h5>
              </div>
              <p className="text-gray-600 ml-6">
                {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Not available"}
              </p>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/settings" className="w-full">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-200 font-medium flex items-center justify-center">
                    <span>Edit Shop</span>
                  </button>
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition duration-200 font-medium flex items-center justify-center"
                >
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;