import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-black text-white">
      {/* Subscription Section */}
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#342ac8] py-7">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
          <span className="text-[#56d879]">Subscribe</span> to get news, <br />
          events, and offers
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="text-gray-800 sm:w-72 w-full sm:mr-5 py-2.5 rounded-md px-4 focus:outline-none"
          />
          <button className="bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2.5 rounded-md text-white md:w-auto w-full">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 text-center sm:text-left">
        <div>
          <img
            src="https://res.cloudinary.com/diljnt1m3/image/upload/v1742545713/X2_sefeti.png"
            alt="Logo"
            className="mx-auto sm:mx-0 brightness-0 invert w-32 sm:w-40 md:w-48 lg:w-56"
          />

          <p className="mt-4 text-gray-400">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex justify-center sm:justify-start mt-4 space-x-4">
            <AiFillFacebook
              size={25}
              className="cursor-pointer hover:text-[#4267B2]"
            />
            <AiOutlineTwitter
              size={25}
              className="cursor-pointer hover:text-[#1DA1F2]"
            />
            <AiFillInstagram
              size={25}
              className="cursor-pointer hover:text-[#E4405F]"
            />
            <AiFillYoutube
              size={25}
              className="cursor-pointer hover:text-[#FF0000]"
            />
          </div>
        </div>

        <div>
          <h1 className="text-lg font-semibold mb-3">Company</h1>
          <ul>
            {footercompanyLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-teal-400 transition duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className="text-lg font-semibold mb-3">Shop</h1>
          <ul>
            {footerProductLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-teal-400 transition duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className="text-lg font-semibold mb-3">Support</h1>
          <ul>
            {footerSupportLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-teal-400 transition duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="text-center text-gray-400 text-sm py-6 border-t border-gray-700">
        <p>© 2025 TradEX. All rights reserved.</p>
        <p className="mt-1">Terms · Privacy Policy</p>
      </div>
    </div>
  );
};

export default Footer;
