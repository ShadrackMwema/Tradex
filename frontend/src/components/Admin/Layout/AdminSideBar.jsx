import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";

const AdminSideBar = ({ active }) => {
  // Array of navigation items to avoid repetition
  const navItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: RxDashboard,
      link: "/admin/dashboard"
    },
    {
      id: 2,
      title: "All Orders",
      icon: FiShoppingBag,
      link: "/admin-orders"
    },
    {
      id: 3,
      title: "All Sellers",
      icon: GrWorkshop,
      link: "/admin-sellers"
    },
    {
      id: 3, // Note: Same ID as above (you might want to fix this)
      title: "Applications",
      icon: GrWorkshop,
      link: "/sellerStatus"
    },
    {
      id: 4,
      title: "All Users",
      icon: HiOutlineUserGroup,
      link: "/admin-users"
    },
    {
      id: 5,
      title: "All Products",
      icon: BsHandbag,
      link: "/admin-products"
    },
    {
      id: 6,
      title: "All Events",
      icon: MdOutlineLocalOffer,
      link: "/admin-events"
    },
    {
      id: 7,
      title: "Withdraw Request",
      icon: CiMoneyBill,
      link: "/admin-withdraw-request"
    },
    {
      id: 8,
      title: "Settings",
      icon: AiOutlineSetting,
      link: "/profile"
    }
  ];

  return (
    <div className="w-full h-[90vh] bg-white shadow-lg rounded-r-lg overflow-y-auto sticky top-0 left-0 z-10 transition-all duration-300">
      <div className="py-6">
        {/* Logo or brand could go here */}
        <div className="px-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 hidden 800px:block">Admin Panel</h3>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const IconComponent = item.icon;
            
            return (
              <Link 
                key={`${item.id}-${item.title}`}
                to={item.link} 
                className={`w-full flex items-center px-4 py-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-red-50 border-l-4 border-red-600" 
                    : "hover:bg-gray-100"
                }`}
              >
                <IconComponent
                  size={22}
                  className={isActive ? "text-red-600" : "text-gray-500"}
                />
                <span
                  className={`hidden 800px:block pl-3 text-[15px] font-medium ${
                    isActive ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;