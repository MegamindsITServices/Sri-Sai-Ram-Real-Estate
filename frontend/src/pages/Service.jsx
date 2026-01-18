import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import service2 from "../assets/service2.jpg";
import home from "../assets/h1.webp";
import working from "../assets/working.jpg";
import Footer from "../component/homepage/Footer";
import Navbar from "../component/homepage/Navbar";
import background from "../assets/project.jpeg";
import SEO from "../component/SEO";

const services = [
  {
    title: "Discover Your Plot",
    description:
      "Explore the perfect piece of land tailored to your needs with ease.",
    icon: home,
    link: "/projects", // Identifier for navigation
  },
  {
    title: "Make the Most of Your Land",
    description:
      "Maximize your land's potential with strategic insights and tools.",
    icon: service2,
  },
  {
    title: "Crafting Your Vision",
    description:
      "Turn your ideas into reality with expert guidance and support.",
    icon: working,
  },
];

const Service = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <SEO
        title="Real Estate & Construction Services | Sri Sai Ram Estate"
        description="Explore expert real estate and construction services by Sri Sai Ram Estate including plot selection, land development, and complete construction solutions."
        url="https://srisairam.co.in/service"
      />

      {/* Header Section - Spacing Unchanged */}
      <div
        className="w-full min-h-72 max-h-72 inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-14 text-white">
          <h1 className="text-4xl fira-sans">Services</h1>
          <p className="text-xl font-[Montserrat]">
            <span
              onClick={() => navigate("/")}
              className="border-b-2 cursor-pointer"
            >
              Home
            </span>{" "}
            {">"} <span>Services</span>
          </p>
        </div>
      </div>

      <section className="py-8 px-5 md:px-[65px] flex items-center justify-center">
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 bg-white">
          <h2 className="text-3xl pl-3 sm:text-4xl fira-sans font-bold text-start text-gray-800 mb-2">
            Our Services
          </h2>
          <div className="max-w-6xl mx-auto py-10 px-5">
            <div className="grid md:grid-cols-1 gap-5">
              {services.map((service, index) => (
                <div
                  key={index}
                  /* Logic: Navigate only if link exists */
                  onClick={() => service.link && navigate(service.link)}
                  className={`flex flex-col md:flex-row items-center transition-all ${
                    service.link
                      ? "cursor-pointer hover:scale-[1.01] duration-200"
                      : ""
                  } ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-full md:w-1/3 h-56 object-cover rounded-sm shadow-lg"
                  />
                  <div className="bg-amber-50 p-6 py-10 rounded-sm shadow-md">
                    <h3 className="text-xl fira-sans">{service.title}</h3>
                    <p className="text-gray-600 font-[Montserrat]">
                      {service.description}
                    </p>

                    {/* Logic: Display contact info only for requested cards */}
                    {(service.title === "Make the Most of Your Land" ||
                      service.title === "Crafting Your Vision") && (
                      <div className="flex flex-wrap gap-4 pt-1">
                        <a
                          href="tel:+919962999658"
                          className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPhoneAlt className="text-[#2B2BD9] text-sm" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase">
                              Phone
                            </p>
                            <p className="text-sm font-bold text-gray-800 tracking-tighter">
                              +91 99629 99658
                            </p>
                          </div>
                        </a>
                        <a
                          href="mailto:contact@srisairam.co.in"
                          className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaEnvelope className="text-[#2B2BD9] text-sm" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase">
                              Email
                            </p>
                            <p className="text-sm font-bold text-gray-800 tracking-tighter">
                              contact@srisairam.co.in
                            </p>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Service;
