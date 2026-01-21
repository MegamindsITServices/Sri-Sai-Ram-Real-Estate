import React, { useState, useEffect } from "react";
import { FaUser, FaSearch, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import Search from '../models/Search';
import Wishlist from "../models/Wishlist";
import Setting from "../models/Setting";
import Logo from "../Logo";
import { setLogOut } from "../../redux/UserSlice";
import { ToggleSearch } from "../../redux/Toggle";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Navbar = ({ setModel }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [setting, setSettingModel] = useState(false);
  // const [model,setModel]=useState(false);
  const [wishModel, setWishModel] = useState(false);
  const handleMouseEnter = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setIsDropdownOpen(true);
    setMobileMenuOpen(false);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Delay before closing
    setTimeoutId(id); // Store timeout ID for clearing
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.length !== 0) navigate(`/properties/search/${search}`);
  };
  const s = useSelector((state) => state.toggle.search);
  const toogleModel = () => {
    console.log(s);
    dispatch(ToggleSearch());
  };
  const logout = () => {
    dispatch(setLogOut());
    toast.success("Logged out successfully");
  };

  const handleNavigation = (path) => {
    if (path === "/") {
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
  };


  const goToContact = () => {
    if (location.pathname === "/") {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
    }
  };




  return (
    <div
      className={`flex justify-between items-center p-4  z-40 lg:pl-20 sticky top-0 transition-all duration-300 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-3xl shadow-md" // Glass effect on scroll
          : "bg-white"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {wishModel && <Wishlist setWishModel={setWishModel} />}
        {setting && <Setting setSettingModel={setSettingModel} />}

        <button onClick={() => handleNavigation("/")}>
          <Logo />
        </button>
      </div>

      <div className="gap-10 flex items-center">
        <div className="hidden md:flex items-center space-x-6 inter">
          <div className="hidden md:flex items-center space-x-6 inter">
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/about")}
            >
              About Us
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/service")}
            >
              Services
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/projects")}
            >
              Projects
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={goToContact}
            >
              Contact Us
            </button>

            {/* {user ? (
              <button
                className="hover:cursor-pointer hover:border-b-2"
                onClick={() => logout()}
              >
                Logout
              </button>
            ) : (
              <button
                className="hover:cursor-pointer hover:border-b-2"
                onClick={() => handleNavigation("/admin-login")}
              >
                Login
              </button>
            )} */}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative ">
            <FaSearch
              className="cursor-pointer"
              onClick={() => toogleModel()}
            />
            {searchVisible && (
              <form
                onSubmit={(e) => handleSearch(e)}
                className="absolute top-full right-0 w-80 bg-white shadow-lg rounded-lg p-2"
              >
                <input
                  className="w-full px-4 py-2 text-gray-700 focus:outline-none border rounded"
                  type="text"
                  placeholder="Search Anything"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Search
                </button>
              </form>
            )}
          </div>

          {/* Profile Dropdown */}
          {/* <div className="relative">
        <div
          className="w-13 py-3 px-3 rounded-md cursor-pointer flex justify-center items-center gap-3 hover:shadow-xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {user ? (
            <img src={user.avatar} alt="profile" className="w-10 h-10 rounded-full" />
          ) : (
            <FaUser className="text-gray-600" />
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <ul className="py-1">
              {user ? (
                <>
                  <li onClick={() => setSettingModel(true)}><li className="px-4 py-2 hover:bg-gray-100">Profile</li></li>
                  <li className="px-4 py-2 hover:bg-gray-100" onClick={() => setWishModel(true)}>Wishlist</li>
                  <Link to="/" onClick={() => logout()}><li className="px-4 py-2 hover:bg-gray-100">Log Out</li></Link>
                </>
              ) : (
                <>
                  <Link to="/login"><li className="px-4 py-2 hover:bg-gray-100">Login</li></Link>
                  <Link to="/register"><li className="px-4 py-2 hover:bg-gray-100">Sign Up</li></Link>
                </>
              )}
            </ul>
          </div>
        )}
      </div> */}

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden">
            <FaBars
              className="text-2xl cursor-pointer"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setIsDropdownOpen(false);
              }}
            />
          </div>
        </div>
      </div>
      {/* Center Section - Links */}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full z-50 bg-white shadow-lg md:hidden ">
          <div className="flex flex-col items-center space-y-4 p-4 z-10">
            {/* <div className="hidden md:flex items-center space-x-6 inter"> */}
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/about")}
            >
              About Us
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/service")}
            >
              Services
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={() => handleNavigation("/projects")}
            >
              Projects
            </button>
            <button
              className="hover:cursor-pointer hover:border-b-2"
              onClick={goToContact}
            >
              Contact Us
            </button>

            {/* {user ? (
              <button
                className="hover:cursor-pointer hover:border-b-2"
                onClick={() => logout()}
              >
                Logout
              </button>
            ) : (
              <button
                className="hover:cursor-pointer hover:border-b-2"
                onClick={() => handleNavigation("/admin-login")}
              >
                Login
              </button>
            )} */}
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
