import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination ,Autoplay} from "swiper/modules";
import Loading from "../Loading";
import FloatingActionAnimationButton from "../button/FloatingActionAnimationButton";

const Products = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showcase, setShowcase] = useState("latest");

  // Use state for navigation elements to ensure Swiper detects them on mount
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

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
    <div className="w-full px-4 py-20 mt-10 bg-[#FFF9EB] overflow-x-hidden">
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
          <div className="relative w-full md:w-[85%] lg:w-[70%] mx-auto">
            {/* Responsive Buttons: 
                - On mobile: Inset (left-0), semi-transparent background for visibility.
                - On Desktop: Outset (md:left-[-60px]), transparent background.
            */}
            <button
              ref={(node) => setPrevEl(node)}
              className="absolute left-0 md:left-[-60px] top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/70 md:bg-transparent shadow-md md:shadow-none rounded-r-lg md:rounded-none text-gray-600 hover:text-black transition-all"
            >
              <span className="text-2xl md:text-4xl">❮</span>
            </button>

            <button
              ref={(node) => setNextEl(node)}
              className="absolute right-0 md:right-[-60px] top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/70 md:bg-transparent shadow-md md:shadow-none rounded-l-lg md:rounded-none text-gray-600 hover:text-black transition-all"
            >
              <span className="text-2xl md:text-4xl">❯</span>
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={25}
              slidesPerView={1}
              loop={true} // 🔁 infinite loop (last → first, first → last)
              autoplay={{
                delay: 3000, // 3 seconds
                disableOnInteraction: false, // user click/swipe won't stop autoplay
                pauseOnMouseEnter: true, // optional: pause on hover (desktop)
              }}
              navigation={{
                prevEl,
                nextEl,
              }}
              speed={500}
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
                    className="bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 group cursor-pointer transition-transform hover:scale-[1.02] mb-2"
                  >
                    {/* Thumbnail with specific 49:75 Aspect Ratio */}
                    <div className="relative w-full aspect-[49/75] overflow-hidden">
                      <img
                        src={
                          product.homeThumbnail?.url ||
                          product.thumbnail?.url ||
                          "/logo.png"
                        }
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Title Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-5 transition-opacity duration-300 group-hover:opacity-0">
                        <h3 className="text-white text-lg font-bold fira-sans">
                          {product.title}
                        </h3>
                      </div>

                      {/* Hover Info Overlay */}
                      <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 bg-black/80 text-white transition-all duration-500 flex flex-col justify-center translate-y-4 group-hover:translate-y-0">
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

                        <p className="text-xs text-gray-300 mb-4 line-clamp-4 font-[Montserrat]">
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
