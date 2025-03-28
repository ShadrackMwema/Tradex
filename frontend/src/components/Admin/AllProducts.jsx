  import { Button, IconButton } from "@material-ui/core";
  import { DataGrid } from "@material-ui/data-grid";
  import React, { useEffect, useState } from "react";
  import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
  import { Link } from "react-router-dom";
  import axios from "axios";
  import Loader from "../Layout/Loader";
  import { server } from "../../server";

  const AllProducts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      axios
        .get(`${server}/product/admin-all-products`, { withCredentials: true })
        .then((res) => {
          setData(res.data.products);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    }, []);

    const handleDelete = (id) => {
      axios
        .delete(`${server}/product/${id}`, { withCredentials: true })
        .then(() => {
          setData((prevData) => prevData.filter((product) => product._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    };

    const columns = [
      { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7, headerClassName: "super-app-theme--header" },
      { field: "name", headerName: "Name", minWidth: 180, flex: 1.4, headerClassName: "super-app-theme--header" },
      { field: "price", headerName: "Price", minWidth: 100, flex: 0.6, headerClassName: "super-app-theme--header" },
      { field: "Stock", headerName: "Stock", minWidth: 80, flex: 0.5, headerClassName: "super-app-theme--header" },
      { field: "sold", headerName: "Sold out", minWidth: 130, flex: 0.6, headerClassName: "super-app-theme--header" },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        flex: 1,
        headerClassName: "super-app-theme--header",
        sortable: false,
        renderCell: (params) => (
          <div className="flex space-x-3">
            <Link to={`/product/${params.id}`}>
              <IconButton className="preview-button">
                <AiOutlineEye size={20} style={{ color: "#3b82f6" }} />
              </IconButton>
            </Link>
            <Link to={`/edit-product/${params.id}`}>
              <IconButton className="edit-button">
                <AiOutlineEdit size={20} style={{ color: "#f59e0b" }} />
              </IconButton>
            </Link>
            <IconButton className="delete-button" onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} style={{ color: "#dc2626" }} />
            </IconButton>
          </div>
        ),
      },
    ];

    const rows = data.map((item) => ({
      id: item._id,
      name: item.name,
      price: `KES ${item.discountPrice}`,
      Stock: item.stock,
      sold: item.sold_out,
    }));

    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="mb-4 px-6 pt-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Product Inventory</h2>
          <p className="text-sm text-gray-500">Manage your products and inventory</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : (
          <div style={{ height: "calc(100% - 80px)", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="product-data-grid"
              sx={{
                "& .MuiDataGrid-root": { border: "none", padding: "0 16px" },
                "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0" },
                "& .super-app-theme--header": { backgroundColor: "#f8fafc", color: "#4b5563", fontWeight: "600" },
                "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f5f9" },
                "& .MuiDataGrid-footerContainer": { borderTop: "1px solid #e5e7eb", backgroundColor: "#f8fafc" },
              }}
            />
          </div>
        )}
      </div>
    );
  };

  export default AllProducts;
