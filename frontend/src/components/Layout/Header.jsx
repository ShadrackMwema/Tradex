import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
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
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { server } from "../../server";
import { FaCoins } from "react-icons/fa";
const Header = ({ activeHeading }) => {
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
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (!user) return;

    const fetchCoins = async () => {
      try {
        const response = await axios.get(`${server}/user/getuser/${user._id}`, {
          withCredentials: true,
        });
        console.log(response.data.user);
        if (response.data.user && response.data.user.coins !== undefined) {
          setCoins(response.data.user.coins);
          console.log(response.data.user.coins);
        } else {
          setError("No coin balance found.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch coin balance."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [user]);

  return (
    <>
      <div className={styles.section}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
        <div>
  <Link to="/">
    <h1 className="text-2xl font-bold">
      <span className="text-green-600">Trade</span>
      <span className="text-black">EX</span>
    </h1>
  </Link>
</div>

          {/* search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[50] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`} key={index}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={i.images[0]?.url}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <div className={styles.button}>
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition-all duration-300 hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md">
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={styles.noramlFlex}>
            <Navbar active={activeHeading} setOpenWishlist={setOpenWishlist} />
          </div>

          <div className="flex">
            <div className={styles.noramlFlex}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={styles.noramlFlex}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={user?.avatar?.url}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
              {/* Display Coin Balance */}
              <IconButton></IconButton>
            </div>
              {isAuthenticated && (
                <div className="text-white mr-[15px] flex items-center">
                  <span className="mr-1">
                    {coins !== undefined ? coins : "Loading..."}
                  </span>
                  <FaCoins size={16} color="#FFD700" /> {/* Coin icon */}
                </div>
              )}

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-50" : ""
        } transition-all duration-300 w-full bg-[#fff] top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex flex-col">
          {/* Top Row: Logo, Menu, Icons */}
          <div className="w-full flex items-center justify-between p-2">
            <div>
              <BiMenuAltLeft
                size={40}
                className="ml-2"
                onClick={() => setOpen(true)}
              />
            </div>
            <div>
  <Link to="/">
    <h1 className="text-2xl font-bold">
      <span className="text-green-600">Trade</span>
      <span className="text-black">EX</span>
    </h1>
  </Link>
</div>


            <div className="flex items-center">
              {/* Wishlist icon */}
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
              {/* Cart icon */}
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
              {isAuthenticated && (
                <div className="text-white mr-[15px] flex items-center">
                  <span className="mr-1 text-black text-[26px]">
                    {coins !== undefined ? coins : "Loading..."}
                  </span>
                  <FaCoins size={16} color="#FFD700" /> {/* Coin icon */}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full p-2">
            <div className="w-full relative">
            <input
  type="text"
  placeholder="Search for Services or Products..."
  value={searchTerm}
  onChange={handleSearchChange}
  className="h-[35px] w-full px-2 border-green-500 border-[2px] rounded-md text-sm"
/>

              {searchData && searchData.length !== 0 ? (
                <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[50] p-4">
                  {searchData &&
                    searchData.map((i, index) => {
                      return (
                        <Link to={`/product/${i._id}`} key={index}>
                          <div className="w-full flex items-start-py-3">
                            <img
                              src={i.images[0]?.url}
                              alt=""
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{i.name}</h1>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* cart popup */}
        {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

        {/* wishlist popup */}
        {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}

        {/* header sidebar */}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-[100] h-full top-0 left-0">
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-[100] overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>{/* Removed wishlist icon from here */}</div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <Navbar
                active={activeHeading}
                setOpenWishlist={setOpenWishlist}
              />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={user.avatar?.url}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
