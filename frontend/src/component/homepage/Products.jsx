import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
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

  // Fetch Showcase
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

  const getDisplayedProducts = () => {
    if (!products) return [];
    let list = [...products];

    if (showcase === "popular") {
      list = list.sort((a, b) => (b.view || 0) - (a.view || 0));
    }

    return list.slice(0, 10);
  };

  const displayedList = getDisplayedProducts();

  return (
    <div className="w-full px-4 py-20 mt-10 bg-[#FFF9EB]">
      <h2 className="text-4xl font-bold text-center mb-6 fira-sans">
        Properties
      </h2>

      <p className="text-xl font-[Montserrat] text-center mb-10">
        Transforming Visions into Reality, Shaping Tomorrow's Landscape.
        <br />
        Innovative Construction for a Brighter Future.
      </p>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="relative w-[85%] md:w-[70%] lg:w-[65%] mx-auto">
            {/* Custom Arrows */}
            <button
              ref={prevRef}
              className="absolute left-[-50px] md:left-[-60px] top-1/2 -translate-y-1/2 z-10 p-3 text-gray-400 hover:text-gray-800"
            >
              <span className="text-3xl">❮</span>
            </button>

            <button
              ref={nextRef}
              className="absolute right-[-50px] md:right-[-60px] top-1/2 -translate-y-1/2 z-10 p-3 text-gray-400 hover:text-gray-800"
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
                        `/projectDetail/${encodeURIComponent(
                          product.title,
                        )}/${product._id}`,
                        { state: product },
                      );
                    }}
                    className="bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 group cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    {/* Aspect Ratio Thumbnail */}
                    <div className="relative w-full aspect-[49/75] overflow-hidden">
                      <img
                        src={product.thumbnail?.url}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                        <h3 className="text-white text-lg font-bold fira-sans">
                          {product.title}
                        </h3>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 bg-black/75 text-white transition-all duration-500 flex flex-col justify-center translate-y-4 group-hover:translate-y-0">
                        {product.category === "house" && (
                          <div className="flex items-center gap-2 text-sm mb-3 font-[Montserrat]">
                            <BiBed className="text-[#F5BE86] text-xl" />
                            <span>{product.bhk} BHK</span>
                            {product.balcony && (
                              <span className="text-[10px] bg-white/20 px-1 rounded">
                                Balcony
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-300 mb-4 line-clamp-3 font-[Montserrat]">
                          {product.description}
                        </p>

                        <div className="space-y-2 border-t border-white/20 pt-4">
                          <div className="flex items-center font-bold text-lg text-[#F5BE86]">
                            ₹{Number(product.price).toLocaleString("en-IN")}
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
