import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { setSeller } from "../../redux/actions/sellers";
import CoinIndicator from "../Products/coinIndicator";

const Header = ({ activeHeading }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch seller data
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(`${server}/shop/getSeller`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setSeller(response.data.seller));
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("Failed to fetch seller data.");
      }
    };

    if (isAuthenticated) {
      fetchSeller();
    }
  }, [isAuthenticated, dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <div className={`${styles.section} bg-white`}>
        <div className="hidden 800px:h-[70px] 800px:my-[10px] 800px:flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="frontend/src/Assests/animations/TradeEX Logo.png"
                alt="TradeEX Logo"
                className="h-12 object-contain"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="w-[50%] relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[45px] w-full px-4 py-2 border-[#3957db] border-2 rounded-md focus:outline-none focus:border-[#253aa3] transition-all"
              />
              <AiOutlineSearch
                size={24}
                className="absolute right-3 text-gray-500"
              />
            </div>
            {searchData && searchData.length !== 0 && (
              <div className="absolute min-h-[30vh] max-h-[70vh] overflow-y-auto w-full bg-white shadow-lg rounded-md z-[50] p-4 mt-1">
                {searchData.map((item, index) => (
                  <Link 
                    to={`/product/${item._id}`} 
                    key={index}
                    className="block hover:bg-slate-100 rounded-md p-2 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-[50px] h-[50px] object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {item.description?.substring(0, 45)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Seller/Dashboard Button */}
          <div>
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <button className="bg-[#3321c8] hover:bg-[#251a94] text-white px-6 py-2 rounded-md font-medium flex items-center transition-all">
                {isSeller ? "Dashboard" : "Become Seller"}
                <IoIosArrowForward className="ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Header/Navbar */}
      <div
        className={`${
          active ? "shadow-md fixed top-0 left-0 z-10 animate-slideDown" : ""
        } transition-all duration-300 hidden 800px:flex items-center justify-between w-full bg-gradient-to-r from-[#3321c8] to-[#4936f5] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* Categories Dropdown */}
          <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
            <div 
              className="flex items-center bg-white h-full w-full pl-10 pr-5 rounded-t-md cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={24} className="absolute top-1/2 -translate-y-1/2 left-3" />
              <span className="font-medium text-lg">All Categories</span>
              <IoIosArrowDown
                size={20}
                className="ml-auto transition-transform duration-300"
                style={{ transform: dropDown ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </div>
            {dropDown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>

          {/* Navbar */}
          <div className={styles.noramlFlex}>
            <Navbar active={activeHeading} setOpenWishlist={setOpenWishlist} />
          </div>

          {/* Icons Section */}
          <div className="flex items-center space-x-5">
            {/* Cart Icon */}
            <div 
              className="relative cursor-pointer group"
              onClick={() => setOpenCart(true)}
            >
              <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                <AiOutlineShoppingCart
                  size={24}
                  color="white"
                />
              </div>
              {cart && cart.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Profile Icon */}
            <div className="relative cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile" className="block p-1 rounded-full border-2 border-white/30 hover:border-white/60 transition-all">
                  <img
                    src={user?.avatar?.url}
                    className="w-[32px] h-[32px] rounded-full object-cover"
                    alt="Profile"
                  />
                </Link>
              ) : (
                <Link to="/login" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                  <CgProfile size={24} color="white" />
                </Link>
              )}
            </div>

            {/* Coin Balance */}
            {isAuthenticated && (
              <div className="text-white flex items-center">
                <CoinIndicator />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active ? "shadow-md fixed top-0 left-0 z-50" : ""
        } transition-all duration-300 w-full bg-white 800px:hidden border-b`}
      >
        <div className="w-full flex flex-col">
          {/* Top Row: Logo, Menu, Icons */}
          <div className="w-full flex items-center justify-between p-3">
            <div>
              <BiMenuAltLeft
                size={28}
                className="text-[#3321c8]"
                onClick={() => setOpen(true)}
              />
            </div>
            <div>
              <Link to="/">
                <img
                  src="/Assests/animations/logo.png"
                  alt="TradeEX"
                  className="h-10 object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
              <div
                className="relative cursor-pointer"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={26} className="text-[#3321c8]" />
                {cart && cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                    {cart.length}
                  </span>
                )}
              </div>
              
              {/* Wishlist Icon */}
              <div
                className="relative cursor-pointer"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={26} className="text-[#3321c8]" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                    {wishlist.length}
                  </span>
                )}
              </div>
              
              {/* Coin Balance on Mobile */}
              {isAuthenticated && (
                <div>
                  <CoinIndicator/>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar on Mobile */}
          <div className="w-full px-3 pb-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for Services or Products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-4 py-2 border-[#3321c8] border-2 rounded-md focus:outline-none focus:border-[#251a94] text-sm transition-all"
              />
              <AiOutlineSearch
                size={20}
                className="absolute right-3 text-gray-500"
              />
            </div>
            {searchData && searchData.length !== 0 && (
              <div className="absolute left-0 right-0 mx-3 bg-white shadow-lg rounded-md z-[50] p-3 mt-1 max-h-[60vh] overflow-y-auto">
                {searchData.map((item, index) => (
                  <Link 
                    to={`/product/${item._id}`} 
                    key={index}
                    className="block hover:bg-slate-100 rounded-md p-2 transition-all mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-[40px] h-[40px] object-cover rounded-md"
                      />
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Popup */}
        {openCart && <Cart setOpenCart={setOpenCart} />}

        {/* Wishlist Popup */}
        {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}

        {/* Mobile Sidebar */}
        {open && (
          <div className="fixed w-full bg-black/50 z-[100] h-full top-0 left-0 backdrop-blur-sm">
            <div className="fixed w-[80%] max-w-[350px] bg-white h-screen top-0 left-0 z-[100] overflow-y-auto shadow-xl animate-slideInLeft">
              <div className="flex items-center justify-between p-4 border-b">
                <Link to="/">
                  <img
                    src="/Assests/animations/logo.png"
                    alt="TradeEX"
                    className="h-8 object-contain"
                  />
                </Link>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <RxCross1 size={20} />
                </button>
              </div>

              {/* Profile Section in Sidebar */}
              <div className="flex flex-col items-center justify-center py-6 border-b">
                {isAuthenticated ? (
                  <div className="text-center">
                    <Link to="/profile">
                      <img
                        src={user.avatar?.url}
                        alt="Profile"
                        className="w-[80px] h-[80px] rounded-full border-4 border-[#3321c8] mx-auto mb-2 object-cover"
                      />
                      <h3 className="font-medium text-lg">{user.name}</h3>
                    </Link>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      to="/login"
                      className="bg-[#3321c8] text-white px-4 py-2 rounded-md"
                    >
                      Login
                    </Link>
                    <Link
                      to="/sign-up"
                      className="border border-[#3321c8] text-[#3321c8] px-4 py-2 rounded-md"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              {/* Navbar in Sidebar */}
              <div className="p-4">
                <Navbar
                  active={activeHeading}
                  setOpenWishlist={setOpenWishlist}
                />
              </div>

              {/* Become Seller Button */}
              <div className="p-4 mt-auto border-t">
                <Link to={isSeller ? "/dashboard" : "/shop-create"}>
                  <button className="w-full bg-[#3321c8] hover:bg-[#251a94] text-white py-3 rounded-md font-medium flex items-center justify-center transition-all">
                    {isSeller ? "Go to Dashboard" : "Become a Seller"}
                    <IoIosArrowForward className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;