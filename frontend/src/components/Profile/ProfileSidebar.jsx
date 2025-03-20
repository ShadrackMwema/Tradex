import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const menuItems = [
    { id: 1, icon: RxPerson, text: "Profile" },
    { id: 2, icon: HiOutlineShoppingBag, text: "Orders" },
    { id: 3, icon: HiOutlineReceiptRefund, text: "Refunds" },
    { id: 4, icon: AiOutlineMessage, text: "Inbox", onClick: () => navigate("/inbox") },
    { id: 5, icon: MdOutlineTrackChanges, text: "Track Order" },
    { id: 6, icon: RiLockPasswordLine, text: "Change Password" },
    { id: 7, icon: TbAddressBook, text: "Address" },
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center cursor-pointer w-full py-3 px-4 rounded-md transition-all duration-200 ${
              active === item.id ? "bg-red-50" : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setActive(item.id);
              item.onClick && item.onClick();
            }}
          >
            <item.icon
              size={22}
              className={`${active === item.id ? "text-red-500" : "text-gray-600"}`}
            />
            <span
              className={`pl-4 font-medium ${
                active === item.id ? "text-red-500" : "text-gray-700"
              } 800px:block hidden`}
            >
              {item.text}
            </span>
          </div>
        ))}

        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div
              className={`flex items-center cursor-pointer w-full py-3 px-4 rounded-md transition-all duration-200 ${
                active === 8 ? "bg-red-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setActive(8)}
            >
              <MdOutlineAdminPanelSettings
                size={22}
                className={`${active === 8 ? "text-red-500" : "text-gray-600"}`}
              />
              <span
                className={`pl-4 font-medium ${
                  active === 8 ? "text-red-500" : "text-gray-700"
                } 800px:block hidden`}
              >
                Admin Dashboard
              </span>
            </div>
          </Link>
        )}

        <div
          className={`flex items-center cursor-pointer w-full py-3 px-4 rounded-md transition-all duration-200 mt-6 ${
            active === 9 ? "bg-red-50" : "hover:bg-gray-50"
          }`}
          onClick={logoutHandler}
        >
          <AiOutlineLogin
            size={22}
            className={`${active === 9 ? "text-red-500" : "text-gray-600"}`}
          />
          <span
            className={`pl-4 font-medium ${
              active === 9 ? "text-red-500" : "text-gray-700"
            } 800px:block hidden`}
          >
            Log out
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;