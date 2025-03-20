import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import Loader from "../Layout/Loader";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    padding: theme.spacing(3),
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginTop: theme.spacing(2),
  },
  button: {
    minWidth: "40px",
    color: "#555",
    transition: "all 0.3s ease",
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  deleteButton: {
    color: "#d32f2f",
    '&:hover': {
      color: "#b71c1c",
    },
  },
}));

const AllEvents = () => {
  const classes = useStyles();
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller) dispatch(getAllEventsShop(seller._id));
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold Out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const productName = params.row.name.replace(/\s+/g, "-");
        return (
          <Link to={`/product/${productName}`}>
            <Button className={classes.button}>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button className={`${classes.button} ${classes.deleteButton}`} onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = events?.map((item) => ({
    id: item._id,
    name: item.name,
    price: `US$ ${item.discountPrice}`,
    Stock: item.stock,
    sold: item.sold_out,
  })) || [];

  return isLoading ? (
    <Loader />
  ) : (
    <div className={classes.container}>
      <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight disableSelectionOnClick />
    </div>
  );
};

export default AllEvents;
