import React, { useState, useEffect, useRef } from "react";
import Review from "../models/Review";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GiveReviewButton from "../button/GiveReviewButton";
import API from "../../utils/API";
import Loading from "../../component/Loading";
import toast from "react-hot-toast";

const Testimonial = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewModel, setReviewModel] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // State to handle pause on hover

  const autoScrollTimer = useRef(null);

  // Fetch Testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await API.get("/testimonial/paginated");
        if (response.data.status) {
          setTestimonials(response.data.testimonials);
          setCurrentIndex(response.data.testimonials.length > 1 ? 1 : 0);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // AUTO SCROLL LOGIC
  useEffect(() => {
    if (!loading && testimonials.length > 1 && !isPaused) {
      autoScrollTimer.current = setInterval(() => {
        handleNext();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [loading, testimonials.length, isPaused]); // Re-run when pause state changes

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    if (testimonials.length === 1) return [null, testimonials[0], null];
    if (testimonials.length === 2) {
      const prev = currentIndex === 0 ? testimonials[1] : testimonials[0];
      return [prev, testimonials[currentIndex], prev];
    }

    const prevIndex =
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;

    return [
      testimonials[prevIndex],
      testimonials[currentIndex],
      testimonials[nextIndex],
    ];
  };

  if (loading)
    return (
      <div className="py-20 bg-[#E9E9FB]">
        <Loading />
      </div>
    );
  if (testimonials.length === 0) return null;

  return (
    <div
      className="relative w-full bg-[#E9E9FB] py-12 px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-36 "
    >
      {reviewModel && <Review setReviewModel={setReviewModel} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="text-left mb-6 sm:mb-0">
          <h2 className="text-2xl sm:text-4xl lg:text-4xl text-gray-900 fira-sans leading-snug">
            Testimonials
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-[Montserrat] mt-2 ">
            This is What Our Clients Say about us
          </p>
        </div>
        <div
          className="text-center sm:ml-4 cursor-pointer mt-3 md:mt-0 "
          onClick={() => navigate("/Testimonials")}
        >
          <GiveReviewButton />
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-20 transition duration-300 bg-white shadow-lg hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-20 transition duration-300 bg-white shadow-lg hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Testimonial Cards */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-9 overflow-hidden">
        {getVisibleTestimonials().map((testimonial, index) => {
          if (!testimonial)
            return <div key={index} className="sm:w-2/5 lg:w-1/4"></div>;

          const isCenterCard = index === 1;

          return (
            <div
              key={testimonial._id}
              className={`transition-all duration-500 transform bg-white p-6 ${
                isCenterCard
                  ? "scale-105 shadow-xl z-10 w-11/12 sm:w-4/5 lg:max-w-[36%] rounded-lg "
                  : "scale-90 opacity-75 flex flex-col items-center w-full sm:w-2/5 lg:w-1/4"
              }`}
            >
              {isCenterCard ? (
                <div
                  onMouseEnter={() => setIsPaused(true)} // Stop scrolling when mouse enters
                  onMouseLeave={() => setIsPaused(false)} // Resume scrolling when mouse leaves
                  className="flex rounded-lg flex-col justify-center"
                >
                  <div className="flex flex-row space-x-4">
                    <img
                      src={testimonial.profileImage || "/default-user.jpg"}
                      alt={testimonial.name}
                      className="w-16 h-16 sm:w-32 sm:h-28 object-cover mb-4 sm:mb-0"
                    />
                    <div className="flex flex-col text-left">
                      <p className="text-base sm:text-lg text-gray-900 font-[Montserrat]">
                        {testimonial.name}
                      </p>
                      {testimonial.job && (
                        <p className="text-sm text-gray-500 font-[Montserrat]">
                          {testimonial.job}
                        </p>
                      )}
                      <div className="flex space-x-1 mt-1">
                        {[...Array(testimonial.star)].map((_, i) => (
                          <span
                            key={i}
                            className="bg-gradient-to-b from-[#faf8e9] via-[#F5BE86] to-[#8f6f4e] text-transparent bg-clip-text"
                          >
                            ★
                          </span>
                        ))}
                        {[...Array(5 - (testimonial.star || 0))].map((_, i) => (
                          <span key={i} className="text-gray-300">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-4 italic text-center font-[Montserrat]">
                    {testimonial.feedback}
                  </p>
                </div>
              ) : (
                <>
                  <img
                    src={testimonial.profileImage || "/default-user.jpg"}
                    alt={testimonial.name}
                    className="w-20 h-16 sm:w-48 sm:h-48 object-cover mb-4 "
                  />
                  <div className="flex space-x-1 mb-3">
                    {[...Array(testimonial.star)].map((_, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-b from-[#faf8e9] via-[#F5BE86] to-[#8f6f4e] text-transparent bg-clip-text"
                      >
                        ★
                      </span>
                    ))}
                    {[...Array(5 - (testimonial.star || 0))].map((_, i) => (
                      <span key={i} className="text-gray-300">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 font-[Montserrat]">
                    {testimonial.name}
                  </p>
                  {testimonial.job && (
                    <p className="text-sm text-gray-500 font-[Montserrat]">
                      {testimonial.job}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Testimonial;
