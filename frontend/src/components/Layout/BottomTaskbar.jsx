import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineAppstore,
  AiOutlineShopping,
  AiOutlinePlus,
  AiFillHome,
  AiFillMessage,
  AiFillAppstore,
  AiFillShopping,
  AiFillPlusCircle,
} from "react-icons/ai";
import { IconButton } from "@material-ui/core";

const BottomTaskbar = () => {
  const location = useLocation();

  // Define the routes for each icon
  const routes = [
    {
      path: "/",
      icon: <AiOutlineHome size={24} />,
      activeIcon: <AiFillHome size={24} />,
      label: "Home",
    },
    {
      path: "/profile",
      icon: <AiOutlineUser size={24} />,
      activeIcon: <AiOutlineUser size={24} className="text-green-500" />, // Use outline icon with green color
      label: "Account",
    },
    {
      path: "/inbox",
      icon: <AiOutlineMessage size={24} />,
      activeIcon: <AiFillMessage size={24} />,
      label: "Messages",
    },
    {
      path: "/services",
      icon: <AiOutlineAppstore size={24} />,
      activeIcon: <AiFillAppstore size={24} />,
      label: "Services",
    },
    {
      path: "/products",
      icon: <AiOutlineShopping size={24} />,
      activeIcon: <AiFillShopping size={24} />,
      label: "Products",
    },
  
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center p-2">
        {routes.map((route, index) => (
          <Link
            to={route.path}
            key={index}
            className={`flex flex-col items-center text-gray-600 hover:text-green-500 ${
              location.pathname === route.path ? "text-green-500" : ""
            }`}
          >
            {location.pathname === route.path ? route.activeIcon : route.icon}
            <span className="text-xs">{route.label}</span>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default BottomTaskbar;