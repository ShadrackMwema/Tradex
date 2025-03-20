import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  // Array of menu items for more maintainable code
  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: (color) => <RxDashboard size={22} color={color} />,
      link: "/dashboard"
    },
    {
      id: 2,
      title: "All Orders",
      icon: (color) => <FiShoppingBag size={22} color={color} />,
      link: "/dashboard-orders"
    },
    {
      id: 3,
      title: "All Products",
      icon: (color) => <FiPackage size={22} color={color} />,
      link: "/dashboard-products"
    },
    {
      id: 4,
      title: "Create Product/Service",
      icon: (color) => <AiOutlineFolderAdd size={22} color={color} />,
      link: "/dashboard-create-product"
    },
    {
      id: 5,
      title: "All Events",
      icon: (color) => <MdOutlineLocalOffer size={22} color={color} />,
      link: "/dashboard-events"
    },
    {
      id: 6,
      title: "Create Event",
      icon: (color) => <VscNewFile size={22} color={color} />,
      link: "/dashboard-create-event"
    },
    {
      id: 7,
      title: "Withdraw Money",
      icon: (color) => <CiMoneyBill size={22} color={color} />,
      link: "/dashboard-withdraw-money"
    },
    {
      id: 8,
      title: "Shop Inbox",
      icon: (color) => <BiMessageSquareDetail size={22} color={color} />,
      link: "/dashboard-messages"
    },
    {
      id: 9,
      title: "Discount Codes",
      icon: (color) => <AiOutlineGift size={22} color={color} />,
      link: "/dashboard-coupouns"
    },
    {
      id: 10,
      title: "Refunds",
      icon: (color) => <HiOutlineReceiptRefund size={22} color={color} />,
      link: "/dashboard-refunds"
    },
    {
      id: 11,
      title: "Settings",
      icon: (color) => <CiSettings size={22} color={color} />,
      link: "/settings"
    }
  ];

  // Group menu items by category
  const mainMenuItems = menuItems.slice(0, 3);
  const contentMenuItems = menuItems.slice(3, 7);
  const financeMenuItems = menuItems.slice(7, 10);
  const otherMenuItems = menuItems.slice(10);

  return (
    <div className="w-full h-[90vh] bg-white shadow-md rounded-lg overflow-y-auto sticky top-0 left-0 z-10 transition-all duration-300">
      {/* Shop Logo/Brand Area */}
      <div className="py-6 px-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 hidden 800px:block">Seller Dashboard</h2>
        <div className="flex items-center justify-center 800px:hidden">
          <span className="text-lg font-bold text-gray-800">SD</span>
        </div>
      </div>

      <div className="p-2">
        {/* Main Navigation */}
        <div className="mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden 800px:block">Main</p>
          <nav>
            {mainMenuItems.map((item) => (
              <Link to={item.link} key={item.id}>
                <div 
                  className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                    active === item.id 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon(active === item.id ? "#dc2626" : "#4b5563")}
                  <span 
                    className={`hidden 800px:block ml-3 font-medium ${
                      active === item.id ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Content Management */}
        <div className="mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden 800px:block">Content</p>
          <nav>
            {contentMenuItems.map((item) => (
              <Link to={item.link} key={item.id}>
                <div 
                  className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                    active === item.id 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon(active === item.id ? "#dc2626" : "#4b5563")}
                  <span 
                    className={`hidden 800px:block ml-3 font-medium ${
                      active === item.id ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Finance & Communications */}
        <div className="mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden 800px:block">Finance & Communications</p>
          <nav>
            {financeMenuItems.map((item) => (
              <Link to={item.link} key={item.id}>
                <div 
                  className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                    active === item.id 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon(active === item.id ? "#dc2626" : "#4b5563")}
                  <span 
                    className={`hidden 800px:block ml-3 font-medium ${
                      active === item.id ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div>
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden 800px:block">Other</p>
          <nav>
            {otherMenuItems.map((item) => (
              <Link to={item.link} key={item.id}>
                <div 
                  className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                    active === item.id 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon(active === item.id ? "#dc2626" : "#4b5563")}
                  <span 
                    className={`hidden 800px:block ml-3 font-medium ${
                      active === item.id ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;