import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Loading from "../Loading";
import FloatingActionAnimationButton from "../button/FloatingActionAnimationButton";

const Products = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showcase, setShowcase] = useState("latest");
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Fetch Projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch paginated but we use a larger limit for the slider
        const response = await API.get("/projects/paginated", {
          params: { limit: 12 },
        });
        if (response.data.status) {
          setProducts(response.data.projects || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Showcase Setting (determines if we show featured, latest, etc)
  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const response = await API.get("/projects/getShowcase");
        if (response.data.status) {
          setShowcase(response.data.showcase?.show || "latest");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchShowcase();
  }, []);

  const incrementProjectView = async (id) => {
    if (!user?._id) return;
    try {
      await API.post("/projects/incrementProjectView", {
        userId: user._id,
        projectId: id,
      });
    } catch (err) {
      console.error("View increment failed", err);
    }
  };

  // Logic to filter/sort based on showcase preference
  const getDisplayedProducts = () => {
    if (!products) return [];
    let list = [...products];

    if (showcase === "featured") {
      // Example: If you had a 'featured' boolean in schema
      // list = list.filter(p => p.isFeatured);
    }

    // Sort by views if showcase is 'popular'
    if (showcase === "popular") {
      list = list.sort((a, b) => (b.view || 0) - (a.view || 0));
    }

    return list.slice(0, 10); // Show top 10 in slider
  };

  const displayedList = getDisplayedProducts();

  return (
    <div className="w-full px-4 py-20 mt-10 bg-[#FFF9EB]">
      <h2 className="text-4xl font-bold text-center mb-6 fira-sans">
        Properties
      </h2>
      <p className="text-xl font-[Montserrat] text-center mb-6">
        Transforming Visions into Reality, Shaping Tomorrow's Landscape.
        <br />
        Innovative Construction for a Brighter Future.
      </p>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="relative w-[85%] md:w-[70%] lg:w-[65%] mx-auto">
            {/* Custom Navigation Buttons */}
            <button
              ref={prevRef}
              className="absolute left-[-50px] md:left-[-60px] top-1/2 transform -translate-y-1/2 z-10 p-3 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <span className="text-3xl">❮</span>
            </button>
            <button
              ref={nextRef}
              className="absolute right-[-50px] md:right-[-60px] top-1/2 transform -translate-y-1/2 z-10 p-3 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <span className="text-3xl">❯</span>
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={25}
              slidesPerView={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full !pb-12"
            >
              {displayedList.map((product, index) => (
                <SwiperSlide key={product._id || index}>
                  <div
                    onClick={() => {
                      incrementProjectView(product._id);
                      navigate(
                        `/projectDetail/${encodeURIComponent(product.title)}/${
                          product._id
                        }`,
                        {
                          state: product,
                        }
                      );
                    }}
                    className="relative bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 group h-96 w-full cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    {/* Background Image Container */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${product.thumbnail?.url})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Gradient Overlay for Title Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <h3 className="text-white text-lg font-bold fira-sans">
                          {product.title}
                        </h3>
                      </div>
                    </div>

                    {/* Hover Content Overlay */}
                    <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 bg-black/75 text-white transition-all duration-500 flex flex-col justify-center translate-y-4 group-hover:translate-y-0">
                      <div className="mb-3">
                        {product.category === "house" && (
                          <div className="flex items-center gap-2 font-[Montserrat] text-sm mb-2">
                            <BiBed className="text-[#F5BE86] text-xl" />
                            <span>{product.bhk} BHK</span>
                            {product.balcony && (
                              <span className="text-[10px] bg-white/20 px-1 rounded">
                                Balcony
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 mb-4 line-clamp-3 font-[Montserrat]">
                        {product.description}
                      </p>

                      <div className="space-y-2 border-t border-white/20 pt-4">
                        <div className="flex items-center font-bold text-lg text-[#F5BE86]">
                          <span className="mr-1">₹</span>
                          {Number(product.price).toLocaleString("en-IN")}
                        </div>

                        <div className="flex items-center text-xs text-gray-200">
                          <FaMapMarkerAlt className="text-red-400 mr-2" />
                          {product.locationTitle}
                        </div>

                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                          Area: {product.totalArea} {product.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div
            className="flex w-full justify-center mt-10"
            onClick={() => navigate("/projects")}
          >
            <FloatingActionAnimationButton />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
