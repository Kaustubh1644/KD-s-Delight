import React from "react";
import Navbar from './../../components/Navbar/Navbar';
import Banner from './../../components/Banner/Banner';
import SpecialOffer from './../../components/SpecialOffer/SpecialOffer';
import AboutHome from './../../components/AboutHome/AboutHome';
import OutHomeMenu from './../../components/OutHomeMenu/OutHomeMenu';
import Footer from './../../components/Footer/Footer';
const Home = () => {
  return (
  <>
    <Navbar/>
    <Banner/>
    <SpecialOffer/>
    <AboutHome/>
   <OutHomeMenu/>
   <Footer/>
  </>
  );
};

export default Home;
 