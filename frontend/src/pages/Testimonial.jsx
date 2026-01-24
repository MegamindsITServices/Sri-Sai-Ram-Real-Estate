// src/pages/Testimonials.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/API";
import Loading from "../component/Loading";
import ShowAll from "../component/button/ShowAll";
import Navbar from "../component/homepage/Navbar";
import Footer from "../component/homepage/Footer";
import background from "../assets/project.jpeg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../component/Loader";
import SEO from "../component/SEO";

const Testimonials = () => {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      const res = await API.get("/testimonial/paginated", {
        params: { page, limit: itemsPerPage },
      });

      if (res.data.status) {
        setTestimonials(res.data.testimonials);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        toast.error("No testimonials found");
      }
    } catch (err) {
      toast.error("Failed to load testimonials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  return (
    <>
      <Navbar />

      <SEO
        title="Client Testimonials | Sri Sai Ram Real Estate & Construction"
        description="Read genuine client testimonials and reviews about Sri Sai Ram Real Estate & Construction and our commitment to quality and trust."
        keywords="real estate testimonials, construction reviews, client reviews Sri Sai Ram"
        url="https://srisairam.co.in/Testimonials"
      />

      {/* Hero Banner */}
      <div
        className="w-full min-h-72 max-h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="flex flex-col justify-end gap-3 h-72 pb-8 px-6 sm:px-14 text-white">
          <h1 className="text-3xl sm:text-4xl font-semibold">Testimonials</h1>
          <p className="text-lg sm:text-xl font-[Montserrat]">
            <span
              onClick={() => navigate("/")}
              className="border-b-2 cursor-pointer"
            >
              Home
            </span>{" "}
            {">"} <span>Testimonials</span>
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 sm:pl-14 pt-10 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide">
          What People Think About
        </h2>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-b from-black via-gray-700 to-black bg-clip-text text-transparent mt-2">
          SRI SAI REAL ESTATE & CONSTRUCTION
        </p>
      </div>

      {/* Testimonials Content */}
      {loading ? (
        <Loader />
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No testimonials available yet.
        </div>
      ) : (
        <>
          <div className="relative w-full bg-white px-6 sm:px-14 py-10 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className={`break-inside-avoid p-6 border border-gray-300 rounded-lg shadow-lg ${
                    index % 2 === 0 ? "bg-[#fff9eb]" : "bg-[#fff1d3]"
                  }`}
                >
                  {/* Profile Section */}
                  <div className="flex items-center gap-4">
                    <img
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
                      alt="Profile"
                      src={testimonial.profileImage || "/default-user.jpg"}
                    />
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-[#1b1c1e]">
                        {testimonial.name}
                      </div>
                      {testimonial.job && <div className="text-sm text-[#6b7280]">
                        {testimonial.job}
                      </div>}
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, idx) => (
                            <span
                              key={idx}
                              className={
                                idx < testimonial.star
                                  ? "bg-gradient-to-b from-[#faf8e9] via-[#F5BE86] to-[#8f6f4e] text-transparent bg-clip-text text-lg"
                                  : "text-gray-300 text-lg"
                              }
                            >
                              ★
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-[#313234] leading-relaxed mt-4">
                    "{testimonial.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10 mb-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>

              <span className="text-lg font-medium px-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                <FaChevronRight className="text-gray-700" />
              </button>
            </div>
          )}
        </>
      )}

      <Footer />
    </>
  );
};

export default Testimonials;
