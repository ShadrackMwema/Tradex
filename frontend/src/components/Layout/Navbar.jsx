import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import { navItems } from '../../static/data';
import styles from '../../styles/styles';
import { AiOutlineHeart } from 'react-icons/ai';

const Navbar = ({ active, setOpenWishlist }) => { // Add setOpenWishlist as a prop
  const { wishlist } = useSelector((state) => state.wishlist);

  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={index}>
            <Link
              to={i.url}
              className={`${
                active === index + 1
                  ? "text-[#17dd1f]"
                  : "text-black 800px:text-[#fff]"
              } pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
            >
              {i.title}
            </Link>
          </div>
        ))}
      {/* Wishlist icon for mobile view */}
      <div className="800px:hidden flex items-center">
        <div
          className="relative cursor-pointer mr-[15px]"
          onClick={() => setOpenWishlist(true)} // Use setOpenWishlist from props
        >
          <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
          <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {wishlist && wishlist.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;