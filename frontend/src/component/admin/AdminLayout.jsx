import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogOut } from "../../redux/UserSlice";
import {
  FaBuilding,
  FaStar,
  FaEnvelope,
  FaSignOutAlt,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

import { CgProfile } from "react-icons/cg";


const AdminLayout = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile menu state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pageTitles = {
    "/admin": "Dashboard",
    "/admin/projects": "Projects",
    "/admin/testimonials": "Testimonials",
    "/admin/messages": "Enquiries",
    "/admin/profile": "Profile",
  };


  const handleLogout = () => {
    dispatch(setLogOut());
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);


  const navItems = [
    { path: "/admin", label: "Dashboard", icon: FaChartBar },
    { path: "/admin/projects", label: "Projects", icon: FaBuilding },
    { path: "/admin/testimonials", label: "Testimonials", icon: FaStar },
    { path: "/admin/messages", label: "Enquiries", icon: FaEnvelope },
    { path: "/admin/admins", label: "Admin Management", icon: IoPeopleSharp },
    { path: "/admin/profile", label: "Profile", icon: CgProfile },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {/* Logo SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="59"
              className="  "
              viewBox="0 0 57 58"
              fill="none"
            >
              <path
                id="Vector 12"
                d="M0.925781 67.0556H9.02047V46.4833L18.0056 39.7063V67.0556H14.3023V13.4665H24.5623V38.0904H20.7578V0.732422H33.7497V54.0562H29.3988V42.2869H43.1193V67.152H38.8292V17.1806L47.7535 23.9817V67.152H56.4553"
                stroke="#F4BE85"
                stroke-width="2"
              />
            </svg>
            <span className="text-xs font-semibold text-[#F4BE85] marcellus-regular">
              SRI SAI RAM REAL ESTATE & CONSTRUCTION
            </span>
          </div>
          {/* Close button for Mobile only */}
          <button className="lg:hidden text-white" onClick={closeSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-[#F5BE86] text-gray-900 font-semibold shadow-lg"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
              end={item.path === "/admin"}
            >
              <item.icon className="mr-3 w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:bg-opacity-10 w-full mt-10 transition"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* OVERLAY for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger for Mobile */}
            <button
              className="lg:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold fira-sans text-gray-800 truncate">
              {pageTitles[location.pathname] || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden sm:inline font-medium text-gray-700">
              {user?.name}
            </span>
            <img
              src={user?.avatar || "/images/avatar.png"}
              alt="Avatar"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
