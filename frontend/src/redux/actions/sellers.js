import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
    //   payload: error.response.data.message,
    });
  }
};
 // Import constants if you have them
// If not, we can define them here
export const LOAD_SELLER_REQUEST = "LoadSellerRequest";
export const LOAD_SELLER_SUCCESS = "LoadSellerSuccess";
export const LOAD_SELLER_FAIL = "LoadSellerFail";

// Action to set seller data
export const setSeller = (seller) => {
  return {
    type: LOAD_SELLER_SUCCESS,
    payload: seller,
  };
};

// Action to start loading seller data
export const loadSellerRequest = () => {
  return {
    type: LOAD_SELLER_REQUEST,
  };
};

// Action for when seller data fails to load
export const loadSellerFail = (error) => {
  return {
    type: LOAD_SELLER_FAIL,
    payload: error,
  };
};

// Get all sellers (for admin)
export const getAllSellersRequest = () => {
  return {
    type: "getAllSellersRequest",
  };
};

export const getAllSellersSuccess = (sellers) => {
  return {
    type: "getAllSellersSuccess",
    payload: sellers,
  };
};

export const getAllSellersFail = (error) => {
  return {
    type: "getAllSellerFailed",
    payload: error,
  };
};

export const clearErrors = () => {
  return {
    type: "clearErrors",
  };
};