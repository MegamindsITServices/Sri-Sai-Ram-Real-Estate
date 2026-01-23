import React from "react";
import Navbar from "../component/homepage/Navbar";
import Footer from "../component/homepage/Footer";
import ContactUs from "../component/homepage/ContactUs";
import SEO from "../component/SEO";
import background from "../assets/project.jpeg";

const ContactUsPage = () => {
  return (
    <>
      <Navbar />

      <SEO
        title="Contact Us | Sri Sai Ram Real Estate"
        description="Get in touch with Sri Sai Ram Real Estate & Construction."
      />

      <div
              className="w-full min-h-72 max-h-72 inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${background})` }}
            >
              <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-14 text-white">
                <h1 className="text-4xl fira-sans">Contact Us</h1>
                <p className="text-xl font-[Montserrat]">
                  <span
                    onClick={() => navigate("/")}
                    className="border-b-2 cursor-pointer"
                  >
                    Home
                  </span>{" "}
                  {">"} <span>Contact Us</span>
                </p>
              </div>
            </div>

      {/* <div className="pt-28 min-h-screen bg-[#E9E9FB]">
        <div className="max-w-7xl mx-auto px-4"> */}
          <ContactUs />
        {/* </div>
      </div> */}

      <Footer />
    </>
  );
};

export default ContactUsPage;
