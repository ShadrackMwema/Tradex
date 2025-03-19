import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import axios from "axios"
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
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
      setZipCode("");
      setAddress("");
      setPhoneNumber("");
      navigate("/verificationForm");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Shop Name" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            <input type="number" name="phoneNumber" placeholder="Phone Number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-field" />
            <input type="email" name="email" placeholder="Email Address" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            <input type="text" name="address" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
            <input type="number" name="zipCode" placeholder="Zip Code" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="input-field" />
            <div className="relative">
              <input type={visible ? "text" : "password"} name="password" placeholder="Password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
              {visible ? (
                <AiOutlineEye className="eye-icon" onClick={() => setVisible(false)} />
              ) : (
                <AiOutlineEyeInvisible className="eye-icon" onClick={() => setVisible(true)} />
              )}
            </div>
            <div className="flex items-center">
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                {avatar ? <img src={avatar} alt="avatar" className="h-full w-full object-cover rounded-full" /> : <RxAvatar className="h-8 w-8" />}
              </span>
              <label htmlFor="file-input" className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Upload Avatar
                <input type="file" id="file-input" onChange={handleFileInputChange} className="sr-only" />
              </label>
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <span className="loader"></span> : "Submit"}
            </button>
            <div className="flex w-full justify-center mt-4">
              <span>Already have an account?</span>
              <Link to="/shop-login" className="text-blue-600 pl-2">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;