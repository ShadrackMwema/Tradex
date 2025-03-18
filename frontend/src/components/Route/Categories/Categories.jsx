import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false); // State to toggle "See All"

  // Number of categories to show initially
  const initialCategoriesToShow = 8;
  const categoriesToDisplay = showAll
    ? categoriesData
    : categoriesData.slice(0, initialCategoriesToShow);

  return (
    <>
      {/* Branding Section (Hidden on Mobile) */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className={`${styles.section} bg-white p-4 rounded-lg mb-12`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Shop by Category</h2>
          {!showAll && categoriesData.length > initialCategoriesToShow && (
            <Link to="/products" className="text-green-500 font-bold">
              See All
            </Link>
          )}
        </div>

        {/* Mobile: Horizontal Scrollable Layout */}
        <div className="sm:hidden flex overflow-x-scroll hide-scrollbar gap-3 pb-4">
          {categoriesToDisplay.map((i) => {
            const handleSubmit = (i) => {
              navigate(`/products?category=${i.title}`);
            };
            return (
              <div
                className="flex flex-col items-center justify-center p-2 border border-green-500 rounded-lg cursor-pointer hover:shadow-md transition-shadow min-w-[80px]"
                key={i.id}
                onClick={() => handleSubmit(i)}
              >
                <img
                  src={i.image_Url}
                  className="w-8 h-8 object-cover mb-1"
                  alt={i.title}
                />
                <h5 className="text-xs text-center font-medium">{i.title}</h5>
              </div>
            );
          })}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categoriesToDisplay.map((i) => {
            const handleSubmit = (i) => {
              navigate(`/products?category=${i.title}`);
            };
            return (
              <div
                className="flex flex-col items-center justify-center p-3 border border-green-500 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                key={i.id}
                onClick={() => handleSubmit(i)}
              >
                <img
                  src={i.image_Url}
                  className="w-12 h-12 object-cover mb-2"
                  alt={i.title}
                />
                <h5 className="text-sm text-center font-medium">{i.title}</h5>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Categories;
