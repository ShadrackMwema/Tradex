import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      });
      toast.success(res.data.message);
      navigate("/verificationForm");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Register as a Seller</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Shop Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          <input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          
          <div className="relative">
            <input type={visible ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
            <button type="button" className="absolute top-3 right-3 text-gray-500" onClick={() => setVisible(!visible)}>
              {visible ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex flex-col items-center justify-center w-20 h-20 bg-gray-200 rounded-full cursor-pointer overflow-hidden">
              {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <RxAvatar className="w-12 h-12 text-gray-500" />}
              <input type="file" onChange={handleFileInputChange} className="hidden" />
            </label>
            <span className="text-gray-600">Upload Profile Picture</span>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center" disabled={loading}>
            {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : "Register"}
          </button>
          
          <div className="text-center text-gray-700 mt-4">
            Already have an account? <Link to="/shop-login" className="text-blue-600 font-semibold">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopCreate;