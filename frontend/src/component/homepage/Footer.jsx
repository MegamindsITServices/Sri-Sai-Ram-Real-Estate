import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin,FaYoutube, FaWhatsapp } from 'react-icons/fa'
import Login from '../../pages/Login';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scrolling effect added here
          });
      };
  return (
    <>
      <h1
        className="bg-[#2222AE] flex justify-center py-2 text-xl font-[Montserrat]  text-white hover:cursor-pointer "
        onClick={scrollToTop}
      >
        Go Back To Top
      </h1>
      <footer className="bg-[#EEEEFC] text-black pt-6 pl-10 md:px-28 px-0 pb-6 ">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-6">
          {/* Logo & Social Media */}
          <div className="">
            <h1 className="text-lg font-semibold mb-3 font-[Montserrat] ">
              <Logo />
            </h1>
            <h1 className="text-2xl fira-sans pl-3">Get Social</h1>
            <div className="flex space-x-3 text-blue-500 pl-3 mt-1">
              <a
                href="https://www.facebook.com/profile.php?id=61553482691210"
                className="text-black hover:text-blue-500"
              >
                <FaFacebook
                  size={20}
                  className="text-blue-600 hover:text-blue-700"
                />
              </a>
              <a
                href={`https://wa.me/9962999658`}
                className="text-black hover:text-blue-500"
              >
                <FaWhatsapp
                  size={20}
                  className="text-blue-600 hover:text-green-500"
                />
              </a>
              <a
                href="https://www.instagram.com/sri_sai_ram_realestate/"
                className="text-black "
              >
                <FaInstagram
                  size={20}
                  className="text-blue-600 hover:text-pink-500"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/srisairam/?originalSubdomain=in"
                className="text-black hover:text-blue-700"
              >
                <FaLinkedin
                  size={20}
                  className="text-blue-600 hover:text-blue-700"
                />
              </a>
              <a
                href="https://www.youtube.com/@SRISAIRAM_REALESTATE"
                className="text-black "
              >
                <FaYoutube
                  size={20}
                  className="text-blue-600 hover:text-red-700"
                />
              </a>
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h2 className="text-md font-medium mb-3 font-[Montserrat">
              Site Map
            </h2>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/service"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Service
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-md font-medium mb-3 font-fira-sana">
              Services
            </h2>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/projects"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Buy
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Land Sale Solution
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="hover:text-black text-sm font-[Montserrat]"
                >
                  Construction
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <h2 className="text-md font-medium mb-3 font-fira-sana">
              Head Office
            </h2>
            <p className="text-sm text-black font-[Montserrat]">
              Office at: NO-2 ANJANEYA PURAM 1st MAIN ROAD KAKKALUR
              THIRUVALLUR-602003
            </p>
            <p className="text-sm text-black font-[Montserrat] mt-1 ">
              Phone:{" "}
              <a href="tel:+919962999658" className="underline">
                +919962999658
              </a>
            </p>
            <p className="text-sm text-black font-[Montserrat] mt-1">
              Email:{" "}
              <a
                className="hover:text-black underline"
                href="mailto:contact@srisairam.co.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                contact@srisairam.co.in
              </a>
            </p>
          </div>
        </div>
      </footer>
      <div className="flex  sm:flex-row justify-between px-2 bg-[#2222AE] text-white text-xs border-t border-gray-700 py-2 font-[Montserrat] md:px-28 ">
        <p>© {new Date().getFullYear()} copyright</p>
        <p>Privacy Policy</p>
        <p>All rights reserved.</p>
      </div>
    </>
  );
}

export default Footer;
