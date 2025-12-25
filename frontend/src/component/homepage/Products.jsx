import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import productData from "../../data/productData";
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
import Animate from "../Animate";
import FloatingActionAnimationButton from "../button/FloatingActionAnimationButton";

const Products = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleViewMore = () => {
    setVisibleProducts((prev) => prev + 3);
  };
  const [showcase, setShowcase] = useState("latest");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    const call = async () => {
      try {
        setLoading(true);
        const data = await API.get("/projects/getAll");
        setProducts(data.data.courses);
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
      }
    };
    call();
  }, []);
  useEffect(() => {
    try {
      const call = async () => {
        const data = await API.get("/projects/getShowcase");
        if (data.data.status) {
          setShowcase(data.data.showcase?.show);
        }
      };

      call();
    } catch (err) {
      toast.error(err.message);
    }
  }, []);
  console.log(products);

  const incrementProjectView = async (id) => {
    await API.post("/projects/incrementProjectView", {
      userId: user._id,
      projectId: id,
    });
  };
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
          <div className="relative w-[60%] mx-auto">
            <button
              ref={prevRef}
              className="swiper-button-prev-custom absolute left-[-60px] top-1/2 transform -translate-y-1/2 rounded-full cursor-pointer p-3 text-gray-600 hover:text-gray-800"
            >
              ❮
            </button>
            <button
              ref={nextRef}
              className="swiper-button-next-custom absolute right-[-60px] top-1/2 transform -translate-y-1/2 rounded-full cursor-pointer p-3 text-gray-600 hover:text-gray-800"
            >
              ❯
            </button>

            {/* Swiper Slider */}
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onSwiper={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {products &&
                // Apply filter or sorting logic based on the showcase prop
                products.slice(0, 8).map((product, index) => (
                  <SwiperSlide key={index}>
                    <div
                      onClick={() => {
                        // if (user !== null) {
                        //   incrementProjectView(product._id);
                        //   navigate(`/projectDetail/${product.title}/${product._id}`, {
                        //     state: product,
                        //   });
                        // } else {
                        //   navigate("/login");
                        // }
                        navigate(
                          `/projectDetail/${product.title}/${product._id}`,
                          {
                            state: product,
                          }
                        );
                      }}
                      className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 group h-96 w-full"
                    >
                      <div
                        className="absolute inset-0 bg-center"
                        style={{
                          backgroundImage: `url(${product.thumbnail})`,
                          backgroundSize: "cover", // Try "contain" if needed
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          width: "100%",
                          height: "100%",
                          imageRendering: "auto", // Try "crisp-edges" or "pixelated" if needed
                        }}
                      >
                        <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-500 flex flex-col items-center justify-end pb-2">
                          <h3 className="text-white w-full text-center text-lg font-semibold">
                            {product.title}
                          </h3>
                        </div>
                      </div>
                      <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 text-white transition-all duration-500 flex flex-col justify-center">
                        <p className="flex items-center mb-2 text-sm">
                          {product.category === "house" && (
                            <p className="flex items-center gap-2 font-[Montserrat]">
                              <BiBed className="font-semibold text-blue-500" />
                              {`${product.bhk} BHK${
                                product.balcony ? " - Balcony" : ""
                              }${product.terrace ? " - Terrace" : ""}`}
                            </p>
                          )}
                        </p>
                        <p className="mb-4 text-xs">
                          {product.description.substring(0, 70)}...
                        </p>
                        <p className="flex items-center font-bold mb-2 text-sm">
                          <p className="mr-2 text-green-400">₹</p>{" "}
                          {Number(product.price).toLocaleString("en-IN")}
                          {/* {Number(product.price).toLocaleString()} */}
                        </p>
                        <p className="flex items-center text-sm">
                          <FaMapMarkerAlt className=" text-red-400" />{" "}
                          {product.locationTitle.substring(0, 10)}...
                        </p>
                        <p className="mt-2 text-sm">
                          Total Area:{" "}
                          {product.unit === "sqft"
                            ? `${product.totalArea} Sq.ft `
                            : product.unit === "Acre"
                            ? `${product.totalArea} Acre`
                            : `${product.totalArea} Cents`}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          {/* View All Button */}
          <div
            className="flex w-full justify-center mt-7"
            onClick={() => navigate("/projects")}
          >
            <FloatingActionAnimationButton />
          </div>

          {/* <div className="text-center mt-12 " onClick={()=>navigate("/projects")}>
        <div className="relative inline-block text-center cursor-pointer group">
          <div className="relative text-black py-2 px-6 text-lg after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#E6AE35] after:transition-transform after:duration-300 after:scale-x-100 group-hover:after:scale-x-0">
            View All
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-[#E6AE35] text-black py-2 px-6 text-lg opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            View All
          </div>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-end opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            <div className="w-2 h-4 bg-[#FFCD62] relative left-1"></div>
            <div className="w-2 h-7 bg-[#FFC74E] relative left-1"></div>
            <div className="w-2 h-10 bg-[#FFC13B]"></div>
            <div className="w-2 h-4 bg-[#FFC74E] relative right-1"></div>
            <div className="w-2 h-5 bg-[#FFCD62] relative right-1"></div>
          </div>
        </div>
      </div> */}
        </>
      )}

      {/* Navigation Arrows */}
    </div>
  );
};

export default Products;
