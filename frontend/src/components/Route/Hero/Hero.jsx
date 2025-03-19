import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[25vh] 800px:min-h-[70vh] w-full bg-no-repeat bg-cover bg-center ${styles.noramlFlex} rounded-lg overflow-hidden`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className={`${styles.section} w-[90%] mx-auto 800px:w-[60%] relative z-10`}>
        <h1
          className={`text-[20px] leading-[1.2] 800px:text-[40px] text-white font-[600] capitalize text-center 800px:text-left animate-fadeIn`}
        >
          Discover Services & Products
        </h1>
        <p className="pt-2 text-[12px] 800px:text-[16px] font-[Poppins] font-[400] text-white text-center 800px:text-left animate-fadeIn delay-100">
          From home repairs to tech gadgets, TradeX has it all.
        </p>

        {/* Buttons Container */}
        <div className="flex flex-row justify-center 800px:justify-start gap-2 mt-3 800px:mt-5">
          {/* Shop Products Button */}
          <Link to="/products" className="inline-block animate-fadeIn delay-200">
            <div
              className={`${styles.button} bg-green-600 hover:bg-green-700 transition-colors rounded-sm 800px:rounded-md px-2.5 py-1.5 transform hover:scale-105 transition-transform`}
            >
              <span className="text-white font-[Poppins] text-[11px] 800px:text-[14px] font-bold">
               Explore Services
              </span>
            </div>
          </Link>

          {/* Explore Services Button */}
          <Link to="/products" className="inline-block animate-fadeIn delay-300">
            <div
              className={`${styles.button} bg-white hover:bg-gray-100 transition-colors rounded-sm 800px:rounded-md px-2.5 py-1.5 transform hover:scale-105 transition-transform`}
            >
              <span className="text-green-600 font-[Poppins] text-[11px] 800px:text-[14px] font-bold">
                Shop Products
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;