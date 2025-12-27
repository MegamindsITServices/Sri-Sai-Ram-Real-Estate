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
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewModel, setReviewModel] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollTimer = useRef(null);
  const MIN_HEIGHT = 450; 

  const cardRefs = useRef([]);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await API.get("/testimonial/paginated");
        if (response.data.status) {
          setTestimonials(response.data.testimonials);
          setCurrentIndex(0);
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

  // FIXED AUTO-SCROLL: Proper cleanup and dependency handling
  useEffect(() => {
    if (!loading && testimonials.length > 1 && !isPaused) {
      autoScrollTimer.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(autoScrollTimer.current);
  }, [loading, testimonials.length, isPaused, currentIndex]); // Added currentIndex to keep timer fresh

  useEffect(() => {
    const activeCard = cardRefs.current[currentIndex];
    if (activeCard) {
      const cardHeight = activeCard.offsetHeight + 40; // padding buffer
      setContainerHeight(Math.max(cardHeight, MIN_HEIGHT));
    }
  }, [currentIndex, testimonials]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#E9E9FB]">
        <Loading />
      </div>
    );

  if (testimonials.length === 0)
    return (
      <div className="py-20 text-center bg-[#E9E9FB]">
        <p className="text-gray-500 font-[Montserrat]">No reviews yet.</p>
        <div className="mt-5" onClick={() => navigate("/Testimonials")}>
          <GiveReviewButton />
        </div>
      </div>
    );

  return (
    <div className="relative w-full bg-[#E9E9FB] py-12 px-4 overflow-hidden">
      {reviewModel && <Review setReviewModel={setReviewModel} />}

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 px-6">
        <div className="text-left">
          <h2 className="text-2xl sm:text-4xl text-gray-900 font-bold leading-snug">
            Testimonials
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-[Montserrat] mt-2">
            This is What Our Clients Say about us
          </p>
        </div>
        <div className="mt-4 sm:mt-0" onClick={() => navigate("/Testimonials")}>
          <GiveReviewButton />
        </div>
      </div>

      <div
        className="relative max-w-7xl mx-auto flex items-center justify-center transition-all duration-500"
        style={{ height: containerHeight }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-40 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all  md:block"
        >
          <svg
            className="h-6 w-6"
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
          className="absolute right-0 z-40 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all md:block"
        >
          <svg
            className="h-6 w-6"
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

        <div className="relative w-full h-full flex items-center justify-center">
          {testimonials.map((testimonial, index) => {
            let position = "hiddenCard";

            if (index === currentIndex) {
              position = "activeCard";
            } else if (
              index ===
              (currentIndex - 1 + testimonials.length) % testimonials.length
            ) {
              position = "prevCard";
            } else if (index === (currentIndex + 1) % testimonials.length) {
              position = "nextCard";
            }

            // DYNAMIC STYLE CALCULATIONS
            const baseClasses =
              "absolute transition-all duration-700 ease-in-out bg-white p-8 rounded-2xl flex flex-col items-center text-center select-none";
            let dynamicStyles = {
              opacity: 0,
              transform: "translateX(0) scale(0.7)",
              zIndex: 0,
              visibility: "hidden",
              width: "min(90%, 450px)",
            };

            if (position === "activeCard") {
              dynamicStyles = {
                transform: "translateX(0) scale(1)",
                opacity: 1,
                zIndex: 30, // Highest
                visibility: "visible",
                width: "min(90%, 450px)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              };
            } else if (position === "prevCard") {
              dynamicStyles = {
                transform: "translateX(-100%) scale(0.8)", // Reduced translate to prevent overlaps
                opacity: 0.6,
                zIndex: 20, // Lower than active
                visibility: "visible",
                width: "min(80%, 400px)",
              };
            } else if (position === "nextCard") {
              dynamicStyles = {
                transform: "translateX(100%) scale(0.8)",
                opacity: 0.6,
                zIndex: 20, // Lower than active
                visibility: "visible",
                width: "min(80%, 400px)",
              };
            }

            return (
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                key={testimonial._id || index}
                className={baseClasses}
                style={dynamicStyles}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <img
                  src={testimonial.profileImage}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-[#E9E9FB]"
                />
                <h3 className="font-bold text-lg text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-blue-600 mb-2">{testimonial.job}</p>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < testimonial.star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  className={`text-gray-600 italic transition-opacity duration-500 ${
                    position === "activeCard"
                      ? "opacity-100"
                      : "opacity-0 line-clamp-4"
                  }`}
                >
                  "{testimonial.feedback}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
