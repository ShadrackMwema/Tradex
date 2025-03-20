import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

 // Add this before your handleSubmit function
const validateForm = () => {
  if (!name) return "Product name is required";
  if (!description) return "Description is required";
  if (!category || category === "Choose a category") return "Category is required";
  if (!discountPrice) return "Discount price is required";
  if (!stock) return "Stock is required";
  if (images.length === 0) return "At least one image is required";
  return null;
};

// Then modify your handleSubmit
const handleSubmit = (e) => {
  e.preventDefault();
  
  const validationError = validateForm();
  if (validationError) {
    toast.error(validationError);
    return;
  }
  
  // Log data being sent to help debug
  console.log("Submitting product data:", {
    name, description, category, tags,
    originalPrice, discountPrice, stock,
    shopId: seller._id, 
    images: images.length // Just log the count for brevity
  });
  
  dispatch(
    createProduct({
      name,
      description,
      category,
      tags,
      originalPrice: Number(originalPrice),
      discountPrice: Number(discountPrice),
      stock: Number(stock),
      shopId: seller._id,
      images,
    })
  );
};
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 overflow-y-auto h-[80vh]">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose a category</option>
            {categoriesData.map((item) => (
              <option key={item.title} value={item.title}>{item.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product tags"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Original Price</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Original price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Price *</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Discount price"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock *</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Stock count"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images *</label>
          <input type="file" multiple className="hidden" onChange={handleImageChange} id="file-upload" />
          <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer text-blue-500">
            <AiOutlinePlusCircle size={24} /> Upload Images
          </label>
          <div className="flex flex-wrap mt-2">
            {images.map((src, index) => (
              <img key={index} src={src} alt="preview" className="h-20 w-20 object-cover m-1 rounded-md" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;