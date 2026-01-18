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
import SEO from '../component/SEO';
import { useRef } from 'react';
const HomePage = () => {
  const location = useLocation();
  const contactRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#contact") {
      const timeout = setTimeout(() => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [location]);

  const togle=()=>{
    toast.success("hello")
  }
  return (
    <>
      <Navbar />

      <SEO
        title="Sri Sai Ram Real Estate & Construction | Trusted Builders Since 1980"
        description="Sri Sai Ram Real Estate & Construction is a trusted real estate and construction company delivering premium residential and commercial projects since 1980."
        keywords="Sri Sai Ram Real Estate, construction company Tamil Nadu, real estate builders, residential construction, commercial construction"
        url="https://srisairam.co.in/"
      />

      <Layout title="Home - SRI SAI ESTATE">
        <div className="bg-[#E9E9FB] p-0 m-0 ">
          <BigImage />
          <Overview />
          <section id="about" className="!mb-0 !pb-0">
            <About />
          </section>
        </div>
        <section id="service">
          <Service />
        </section>
        <section id="projects">
          <Products />
        </section>

        <Testimonial />
        <section id="contact" ref={contactRef} className="scroll-mt-28">
          <ContactUs />
        </section>
      </Layout>

      <Footer />
    </>
  );
}

export default HomePage;
