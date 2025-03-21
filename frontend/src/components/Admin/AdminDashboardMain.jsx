import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import TransactionCard from "./Transactioncard";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning = adminOrders && adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.10, 0);
  const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        return (
          <div className={`${params.value === "Delivered" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} py-1 px-2 rounded-full text-xs font-medium`}>
            {params.value}
          </div>
        );
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
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  // Stat card component for reusability
  const StatCard = ({ icon: Icon, title, value, linkTo, linkText }) => (
    <div className="w-full mb-4 800px:w-[32%] bg-white shadow-md rounded-lg px-6 py-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center">
        <div className="p-3 bg-blue-50 rounded-full mr-4">
          <Icon size={24} className="text-blue-600" />
        </div>
        <h3 className="text-gray-600 font-medium text-lg">{title}</h3>
      </div>
      <h5 className="pt-3 text-2xl font-bold text-gray-800">
        {title === "Total Earning" ? "$ " : ""}{value}
      </h5>
      {linkTo && (
        <Link to={linkTo} className="group">
          <div className="flex items-center pt-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">
            <span>{linkText}</span>
            <AiOutlineArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
          </div>
        </Link>
      )}
    </div>
  );

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
          <h3 className="text-2xl font-bold text-gray-800 pb-4">Overview</h3>
          
          <div className="w-full flex flex-col 800px:flex-row items-stretch justify-between gap-4">
            <StatCard 
              icon={AiOutlineMoneyCollect} 
              title="Total Earning" 
              value={adminBalance} 
            />
            
            <StatCard 
              icon={MdBorderClear} 
              title="All Sellers" 
              value={sellers && sellers.length} 
              linkTo="/admin-sellers" 
              linkText="View Sellers" 
            />
            
            <StatCard 
              icon={AiOutlineMoneyCollect} 
              title="All Orders" 
              value={adminOrders && adminOrders.length} 
              linkTo="/admin-orders" 
              linkText="View Orders" 
            />
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Latest Orders</h3>
              <Link to="/admin-orders" className="text-blue-600 hover:text-blue-800 flex items-center">
                View All <AiOutlineArrowRight className="ml-1" />
              </Link>
            </div>
            
            <div className="w-full bg-white rounded-lg shadow-md p-4">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                autoHeight
                className="bg-white"
                headerHeight={50}
                rowHeight={60}
                loading={adminOrderLoading}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <TransactionCard />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;