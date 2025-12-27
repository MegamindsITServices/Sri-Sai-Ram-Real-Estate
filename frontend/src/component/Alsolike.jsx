import React, { useState, useRef, useEffect } from "react";
import LikeCard from "./cards/LikeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../utils/API";
import Loading from "./Loading";

const Alsolike = ({ id, category }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const [products, setProducts] = useState(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount =
        direction === "left" ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });

      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 500);
    }
  };

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        // Calling the specific also-like API
        const res = await API.get(`/projects/also-like/${id}`, {
          params: { category }, // optional category filter
        });
        if (res.data.status) {
          setProducts(res.data.projects);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    if (id) fetchSimilar();
  }, [id, category]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  if (products && products.length === 0) return null; // Hide if no suggestions

  return (
    <div className="bg-amber-50/50 p-6 px-4 md:px-12 rounded-2xl mt-10 border border-amber-100">
      <h2 className="text-3xl font-bold mb-8 fira-sans text-gray-800">
        You May Also Like
      </h2>
      {products ? (
        <div className="relative group">
          {/* Left button */}
          <button
            onClick={() => scroll("left")}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl transition-all ${
              scrollPosition <= 0
                ? "opacity-0 invisible"
                : "opacity-100 visible hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={handleScroll}
          >
            {products.map((property) => (
              <LikeCard property={property} key={property._id} />
            ))}
          </div>

          {/* Right button */}
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl transition-all ${
              scrollContainerRef.current &&
              scrollPosition >=
                scrollContainerRef.current.scrollWidth -
                  scrollContainerRef.current.offsetWidth -
                  10
                ? "opacity-0 invisible"
                : "opacity-100 visible hover:bg-gray-50"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center py-12">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Alsolike;
