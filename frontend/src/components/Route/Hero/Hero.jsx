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
      <div className={`${styles.section} w-[90%] 800px:w-[60%] relative z-10`}>
        <h1
          className={`text-[20px] leading-[1.2] 800px:text-[40px] text-white font-[600] capitalize`}
        >
          Market Your Services Today
        </h1>
        <p className="pt-2 text-[12px] 800px:text-[16px] font-[Poppins] font-[400] text-white">
          Reach more customers and grow your business with us.
        </p>
        <Link to="/products" className="inline-block">
          <div
            className={`${styles.button} mt-3 800px:mt-5 bg-green-600 hover:bg-green-700 transition-colors rounded-sm 800px:rounded-md`}
          >
            <span className="text-[#fff] font-[Poppins] text-[14px] 800px:text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;