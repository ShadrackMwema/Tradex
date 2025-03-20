import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { Country, State } from "country-state-city";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";

// Icons
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

// Redux actions
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { getAllOrdersOfUser } from "../../redux/actions/order";

// Components
import SellerApplicationForm from "../Shop/verificationForm";
import SellerApplicationStatus from "./status";
import CoinPurchaseCard from "./coinPurchase";

// Styles
import styles from "../../styles/styles";
import { server } from "../../server";

const ProfileContent = ({ active }) => {
  const dispatch = useDispatch();
  const { user, error, successMessage } = useSelector((state) => state.user);

  // User form states
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Handle notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage, dispatch]);

  // Handle profile update
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  // Handle avatar update
  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {/* Common components for all sections */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <CoinPurchaseCard />
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <SellerApplicationStatus />
        </div>
      </div>
      {/* Profile Section */}
      {active === 1 && (
        <ProfileSection
          user={user}
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          password={password}
          setPassword={setPassword}
        />
      )}

      {/* Orders Section */}
      {active === 2 && <AllOrders />}

      {/* Refund Section */}
      {active === 3 && <AllRefundOrders />}

      {/* Track Order Section */}
      {active === 5 && <TrackOrder />}

      {/* Change Password Section */}
      {active === 6 && <ChangePassword />}

      {/* Address Section */}
      {active === 7 && <Address />}
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({
  user,
  handleSubmit,
  handleImage,
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
}) => {
  return (
    <>
      <div className="flex justify-center w-full mb-8">
        <div className="relative">
          <img
            src={`${user?.avatar?.url}`}
            className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
            alt="Profile"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image" className="cursor-pointer">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>

      <div className="w-full px-5">
        <form
          onSubmit={handleSubmit}
          aria-required={true}
          className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Update Profile
          </h2>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

// All Orders Component
const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">My Orders</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="bg-white"
        />
      </div>
    </div>
  );
};

// Refund Orders Component
const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">My Refunds</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          autoHeight
          disableSelectionOnClick
          className="bg-white"
        />
        {row.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No refund orders found
          </p>
        )}
      </div>
    </div>
  );
};

// Track Order Component
const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/track/order/${params.id}`}>
            <Button>
              <MdTrackChanges size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Track Orders</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="bg-white"
        />
      </div>
    </div>
  );
};

// Change Password Component
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
          Change Password
        </h2>

        <form onSubmit={passwordChangeHandler} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

// Address Component
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full p-4">
      {/* Modal for adding new address */}
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-full max-w-md h-[80vh] bg-white rounded-lg shadow-lg relative overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">Add New Address</h2>
              <RxCross1
                size={24}
                className="cursor-pointer hover:text-red-500"
                onClick={() => setOpen(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">Select your country</option>
                  {Country &&
                    Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  City/State
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  disabled={!country}
                >
                  <option value="">Select your city/state</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Street address, P.O. box, etc."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip or postal code"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Address Type
                </label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">Select address type</option>
                  {addressTypeData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address list section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-700">My Addresses</h2>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center"
          >
            <span>Add New</span>
          </button>
        </div>

        <div className="space-y-4">
          {user && user.addresses && user.addresses.length > 0 ? (
            user.addresses.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50"
              >
                <div className="mb-2 md:mb-0">
                  <span className="inline-block px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm font-medium mb-2">
                    {item.addressType}
                  </span>
                  <p className="text-gray-700">
                    {item.address1}
                    {item.address2 ? `, ${item.address2}` : ""}
                  </p>
                  <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-500 hover:text-red-700 flex items-center self-end md:self-center mt-2 md:mt-0"
                >
                  <AiOutlineDelete size={20} className="mr-1" />
                  <span>Remove</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You don't have any saved addresses.</p>
              <p className="mt-2">Add a new address to make checkout faster!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
