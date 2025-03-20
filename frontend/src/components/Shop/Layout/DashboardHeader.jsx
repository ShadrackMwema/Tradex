import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  
  const navigationLinks = [
    { to: "/dashboard/cupouns", icon: AiOutlineGift, label: "Coupons" },
    { to: "/dashboard-events", icon: MdOutlineLocalOffer, label: "Offers" },
    { to: "/dashboard-products", icon: FiShoppingBag, label: "Products" },
    { to: "/dashboard-orders", icon: FiPackage, label: "Orders" },
    { to: "/dashboard-messages", icon: BiMessageSquareDetail, label: "Messages" }
  ];

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard" className="flex items-center">
          <Typography>TradEX</Typography>
        </Link>
      </div>
      
      <div className="flex items-center mt-4">
        <nav className="hidden md:flex items-center mr-6">
          {navigationLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link 
                key={index}
                to={link.to} 
                className="group flex flex-col items-center mx-3 transition-colors duration-200 hover:text-blue-600"
                title={link.label}
              >
                <Icon 
                  color="#555" 
                  size={26} 
                  className="cursor-pointer group-hover:text-blue-600 transition-colors duration-200" 
                />
                <span className="text-xs mt-1 hidden lg:block text-gray-600 group-hover:text-blue-600">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <Link 
          to={`/shop/${seller._id}`}
          className="relative flex items-center"
        >
          {seller.avatar?.url ? (
            <img
              src={seller.avatar.url}
              alt={`${seller.name || 'Seller'}'s Profile`}
              className="w-[45px] h-[45px] rounded-full object-cover border-2 border-gray-200 transition-all duration-200 hover:border-blue-500"
            />
          ) : (
            <div className="w-[45px] h-[45px] rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              {seller.name ? seller.name.charAt(0).toUpperCase() : 'S'}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;