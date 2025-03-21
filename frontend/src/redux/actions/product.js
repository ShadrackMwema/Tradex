import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const timestamp = new Date().toISOString(); // Generate a valid timestamp
    const payload = {
      ...productData,
      timestamp,
    };

    console.log("Payload being sent to backend:", payload); // Log the payload
    console.log("Current client time:", new Date().toISOString()); // Log the client time

    const { data } = await axios.post(
      `${server}/product/create-product`,
      payload,
      {
        headers: {
          "Content-Type": "application/json", // Ensure proper headers
        },
      }
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    console.error("Error creating product:", error.response?.data); // Log full error response
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.error("Error fetching products for shop:", error.response?.data); // Log error
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: {
        products: data.products,
        locations: data.locations
      },
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};