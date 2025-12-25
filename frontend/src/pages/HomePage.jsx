import React,{useEffect,useState} from 'react';
import  Navbar  from '../component/homepage/Navbar';
import BigImage from '../component/homepage/BigImage';
import Overview from '../component/homepage/Overview';
import About from '../component/homepage/About';
import Service from '../component/homepage/Service';
import Products from '../component/homepage/Products';
import ContactUs from '../component/homepage/ContactUs';
import Footer from '../component/homepage/Footer';
import Testimonial from '../component/homepage/Testimonial';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import {Helmet} from "react-helmet"
import Search from '../component/models/Search';
import Layout from '../component/layout/Layout';
const HomePage = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const togle=()=>{
    toast.success("hello")
  }
  return (
    <>
    <Navbar />
    <Helmet>
      <title>Home - SRI SAI ESTATE</title>
      <meta name="description" content="Explore top-rated properties for sale and rent with SRI SAI Real Estate. From luxury apartments to family homes, we help you find the perfect property in your desired location." />
      <meta name="keywords" content="real estate, buy home, rent property, luxury apartments, family houses, commercial spaces, SRI SAI Real Estate" />
      <meta name="author" content="SRI SAI Real Estate" />
    </Helmet>

<Layout title="Home - SRI SAI ESTATE">
 <div className="bg-[#E9E9FB] p-0 m-0 md:h-[1250px] lg:h-[1200px] overflow-hidden ">

      
      <BigImage/>
      <Overview/>
      <section id="about" className="!mb-0 !pb-0">
   
        <About/>
      </section>
      
    </div>
     <section id='service'>
      <Service/>
     </section>
      <section id='projects'>
        <Products/>
      </section>
      
      <Testimonial/>
      <section id='contact'>
        <ContactUs/>
      </section>
</Layout>
   
      
      <Footer/>
    </>
  );
}

export default HomePage;
