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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const validateForm = () => {
    if (!name) return "Product name is required";
    if (!description) return "Description is required";
    if (!category || category === "Choose a category")
      return "Category is required";
    if (!discountPrice || isNaN(discountPrice))
      return "Discount price is required and must be a number";
    if (!stock || isNaN(stock) || stock < 0)
      return "Stock is required and must be a non-negative number";
    if (images.length === 0) return "At least one image is required";
    if (originalPrice && discountPrice >= originalPrice)
      return "Discount price must be less than the original price";
    return null;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setImages([]);

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.readyState === 2) {
          try {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = 800;
              canvas.height = (img.height / img.width) * 800;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const compressedImage = canvas.toDataURL("image/jpeg", 0.8);
              setImages((old) => [...old, compressedImage]);
            };

            img.onerror = () => {
              toast.error("Failed to load image. Please try again.");
            };
          } catch (err) {
            console.error("Error compressing image:", err);
            toast.error("Failed to process image. Please try again.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }

    const discountPriceNumber = Number(discountPrice);
    const stockNumber = Number(stock);

    if (isNaN(discountPriceNumber) || isNaN(stockNumber)) {
      toast.error("Invalid discount price or stock value.");
      setIsLoading(false);
      return;
    }

    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice: Number(originalPrice),
      discountPrice: discountPriceNumber,
      stock: stockNumber,
      shopId: seller._id,
      shop: seller,
      sellerLocation: seller.address, // Ensure this field is included
      previewInfo: description.substring(0, 100), // Required field
      fullInfo: description, // Required field
      images,
    };

    console.log("Product data being submitted:", productData); // Log the product data

    try {
      await dispatch(createProduct(productData));
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 overflow-y-auto h-[80vh]">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        Create Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose a category</option>
            {categoriesData.map((item) => (
              <option key={item.title} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Original price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Price *
            </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Stock *
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Stock count"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Images *
          </label>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleImageChange}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 cursor-pointer text-blue-500"
          >
            <AiOutlinePlusCircle size={24} /> Upload Images
          </label>
          <div className="flex flex-wrap mt-2">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="preview"
                className="h-20 w-20 object-cover m-1 rounded-md"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
