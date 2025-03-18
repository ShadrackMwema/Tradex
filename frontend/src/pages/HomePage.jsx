import React from 'react';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import BottomTaskbar from '../components/Layout/BottomTaskbar';
import ProductList from '../components/Route/NearYou/ProductList';
import LocationFilter from '../components/Layout/LocationFilter';

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <div className="mb-8"> {/* Space between Header and Hero */}
        <Hero />
      </div>
      <LocationFilter/>
      <Categories />
      {/* <ProductList/> */}
      <BestDeals />
      <Events />
      <FeaturedProduct />
      {/* <Sponsored /> */}
      <Footer />
      <BottomTaskbar />
    </div>
  );
};

export default HomePage;