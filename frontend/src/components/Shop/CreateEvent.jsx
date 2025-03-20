import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!name || !description || !category || !discountPrice || !stock || !startDate || !endDate) {
      toast.error("Please fill out all required fields.");
      return;
    }
  
    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };
  
    dispatch(createevent(data));
  };
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-green-400 to-green-600 shadow-lg rounded-lg p-6 text-white">
      <h5 className="text-3xl font-semibold text-center mb-4">Create Event</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg">Name <span className="text-red-500">*</span></label>
          <input type="text" className="w-full p-2 rounded border border-gray-300 text-black" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter event name..." />
        </div>
        <div>
          <label className="block text-lg">Description <span className="text-red-500">*</span></label>
          <textarea className="w-full p-2 rounded border border-gray-300 text-black" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter event description..."></textarea>
        </div>
        <div>
          <label className="block text-lg">Category <span className="text-red-500">*</span></label>
          <select className="w-full p-2 rounded border border-gray-300 text-black" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choose a category</option>
            {categoriesData.map((i) => (
              <option key={i.title} value={i.title}>{i.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-lg">Tags</label>
          <input type="text" className="w-full p-2 rounded border border-gray-300 text-black" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Enter event tags..." />
        </div>
        <div>
          <label className="block text-lg">Original Price</label>
          <input type="number" className="w-full p-2 rounded border border-gray-300 text-black" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Enter original price..." />
        </div>
        <div>
          <label className="block text-lg">Discount Price <span className="text-red-500">*</span></label>
          <input type="number" className="w-full p-2 rounded border border-gray-300 text-black" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="Enter discount price..." />
        </div>
        <div>
          <label className="block text-lg">Stock <span className="text-red-500">*</span></label>
          <input type="number" className="w-full p-2 rounded border border-gray-300 text-black" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Enter stock..." />
        </div>
        <div className="flex justify-center items-center">
          <input type="submit" value="Create Event" className="bg-white text-green-600 font-bold py-2 px-6 rounded-lg cursor-pointer hover:bg-gray-200 transition" />
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
