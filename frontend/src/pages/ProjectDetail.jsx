import React, { useState, useEffect } from "react";
import Navbar from "../component/homepage/Navbar";
import background from "../assets/project.jpeg";
import { useLocation, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMapMarked,
  FaShareAlt,
  FaHome,
  FaArrowRight,
  FaThLarge,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { BiBed, BiArea } from "react-icons/bi";
import Footer from "../component/homepage/Footer";
import { useSelector } from "react-redux";
import API from "../utils/API";
import { useNavigate } from "react-router-dom";
import Share from "../component/models/Share";
import toast from "react-hot-toast";
import Loading from "../component/Loading";
import Alsolike from "../component/Alsolike";
import Layout from "../component/layout/Layout";
import SEO from "../component/SEO";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [project, setProject] = useState(null);
  const [shareModel, setShareModel] = useState(false);
  const [listingPhoto, setListingPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openGalleryModal = () => setIsGalleryModalOpen(true);
  const closeGalleryModal = () => setIsGalleryModalOpen(false);

  const contactRef = React.useRef(null);
  const swiperRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? listingPhoto.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === listingPhoto.length - 1 ? 0 : prev + 1,
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await API.post("/projects/getProject", {
          _id: id,
        });
        if (data.data.status) {
          const projectData = data.data.project;
          setProject(projectData);

          let photos = [];
          const thumbnailUrl =
            projectData.thumbnail?.url || projectData.thumbnail;
          if (thumbnailUrl) {
            photos.push(thumbnailUrl);
          }

          if (
            projectData.listingPhotoPaths &&
            Array.isArray(projectData.listingPhotoPaths)
          ) {
            projectData.listingPhotoPaths.forEach((photo) => {
              const photoUrl = photo?.url || photo;
              if (photoUrl) {
                photos.push(photoUrl);
              }
            });
          }

          const floorImageUrl =
            projectData.floorImage?.url || projectData.floorImage;
          if (floorImageUrl) {
            photos.push(floorImageUrl);
          }

          setListingPhotos(photos);
        } else {
          console.log(data.data.message);
          toast.error("Failed to load project details");
        }
      } catch (err) {
        console.error(err.message);
        toast.error("Error loading project");
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        if (!user?._id || !id) return;

        const response = await API.get(`/wishlist/getWishlist`, {
          params: { userId: user._id, listingId: id },
        });
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist status", error);
      }
    };

    fetchWishlistStatus();
  }, [user, id]);

  const handleWishlistToggle = async () => {
    try {
      if (!user?._id) {
        toast.error("Please login to update wishlist");
        navigate("/login");
        return;
      }

      const response = await API.post(`/wishlist/postWishlist`, {
        userId: user._id,
        listingId: id,
      });

      if (response.data.success) {
        setIsInWishlist(!isInWishlist);
        toast.success(
          isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        );
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
      toast.error("Failed to update wishlist");
    }
  };

  const isHome =
    project?.category === "villa" ||
    project?.category === "apartment" ||
    project?.category === "house";

  const isLayout =
    project?.category === "commercial_layout" ||
    project?.category === "residential_layout";

  const isPlot =
    project?.category === "residential" || project?.category === "commercial";

  const [contact, openContact] = useState(false);

  const getThumbnailUrl = () => {
    if (!project?.thumbnail) return "";
    return project.thumbnail.url || project.thumbnail;
  };

  const getFloorImageUrl = () => {
    if (!project?.floorImage) return "";
    return project.floorImage.url || project.floorImage;
  };

  const getPriceFormatted = () => {
    if (!project?.price) return "Price not available";
    return Number(project.price).toLocaleString("en-IN");
  };

  const getDescription = () => {
    return project?.description || "No description available";
  };

  const getLocationTitle = () => {
    return project?.locationTitle || "Location not specified";
  };

  const getLocationLink = () => {
    return project?.locationLink || "#";
  };

  const getPlotNumber = () => {
    return project?.plotNumber || "N/A";
  };

  const getStartingPlotSize = () => {
    return project?.startingPlotSize || "N/A";
  };

  const getStartingUnit = () => {
    return project?.startingPlotUnit || "N/A";
  };
  console.log(getStartingUnit());

  const getStartingPlotSizeFormatted = () => {
    if (!getStartingPlotSize() || (!getUnit() && !getStartingUnit()))
      return "N/A";
    const unitMap = {
      sqft: "Sq. Ft",
      Acre: "Acres",
      Cents: "Cents",
    };
    return `${getStartingPlotSize()} ${unitMap[getStartingUnit()] || getUnit()}`;
  };

  const getTotalArea = () => {
    return project?.totalArea || 0;
  };

  const getUnit = () => {
    return project?.unit || "";
  };

  const getBHK = () => {
    return project?.bhk || "";
  };

  const getCategory = () => {
    return project?.category || "";
  };

  const getStatus = () => {
    return project?.status || "available";
  };

  const getAreaFormatted = () => {
    if (!getTotalArea() || !getUnit()) return "N/A";
    const unitMap = {
      sqft: "Sq. Ft",
      Acre: "Acres",
      Cents: "Cents",
    };
    return `${getTotalArea()} ${unitMap[getUnit()] || getUnit()}`;
  };

  return (
    <>
      <Navbar />

      <SEO
        title={`${project?.title || "Project"} | Sri Sai Ram Real Estate`}
        description={`Explore ${
          project?.title || "Property"
        } located in ${getLocationTitle()}. ${getAreaFormatted()} ${getCategory()} available at ₹${getPriceFormatted()}.`}
        keywords={`${
          project?.title || "Property"
        }, plots in ${getLocationTitle()}, buy ${getCategory()}, real estate investment`}
        image={getThumbnailUrl()}
        url={window.location.href}
        type="article"
      />

      <Layout
        title={`${project?.title || "Project"} - SRI SAI ESTATE`}
        description={`Explore ${
          project?.title || "Property"
        } – ${getAreaFormatted()} located in ${getLocationTitle()}. Get complete details including price, floor plans, amenities, and more.`}
        keywords={`${
          project?.title || "Property"
        }, real estate in ${getLocationTitle()}, ${getAreaFormatted()}, project floor plans, real estate investment`}
      >
        {/* Image Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-5xl">
              <button
                className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <img
                src={getFloorImageUrl()}
                alt="Floor Plan"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {isGalleryModalOpen && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-6xl">
              <button
                className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
                onClick={closeGalleryModal}
              >
                <FaTimes />
              </button>

              <div className="relative">
                <img
                  src={listingPhoto[currentIndex]}
                  alt={`Gallery ${currentIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />

                {listingPhoto.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {listingPhoto.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {shareModel && project && (
          <Share
            setShareModel={setShareModel}
            image={getThumbnailUrl()}
            title={project.title}
            url={window.location.href}
          />
        )}

        {/* Hero Banner */}
        <div className="relative">
          <div
            className="w-full h-80 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          </div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-6 pb-10">
              <nav className="text-white mb-4">
                <ol className="flex items-center space-x-2 text-sm md:text-base">
                  <li>
                    <button
                      onClick={() => navigate("/")}
                      className="hover:text-gray-300 transition-colors"
                    >
                      Home
                    </button>
                  </li>
                  <li className="text-gray-300">/</li>
                  <li>
                    <button
                      onClick={() => navigate("/projects")}
                      className="hover:text-gray-300 transition-colors"
                    >
                      Projects
                    </button>
                  </li>
                  <li className="text-gray-300">/</li>
                  <li className="font-semibold text-white">Project Detail</li>
                </ol>
              </nav>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Projects
              </h1>
              <p className="text-gray-200">Detailed view of the property</p>
            </div>
          </div>
        </div>

        {project ? (
          <div className="container mx-auto px-4 md:px-6 py-8">
            {/* Property Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {project.title || "Untitled Property"}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-[#2B2BD9]" />
                    <span>{getLocationTitle()}</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStatus() === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStatus() === "available" ? "Available" : "Sold Out"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold text-[#2B2BD9]">
                    {isLayout ? "Starting Price" : ""} ₹{getPriceFormatted()}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {isLayout && project.startingPlotSize
                      ? "Starting Plot Size: " + getStartingPlotSizeFormatted()
                      : "Total Project Area: " + getAreaFormatted()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShareModel(true)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Share"
                  >
                    <FaShareAlt className="text-green-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Image & Gallery */}
              <div className="lg:col-span-2 space-y-8">
                {/* Main Image with Gallery Swiper */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative group">
                    {listingPhoto.length > 0 && (
                      <Swiper
                        key={listingPhoto.length} // ✅ forces rebuild when data loads
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={listingPhoto.length > 1}
                        autoplay={
                          listingPhoto.length > 1
                            ? {
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                              }
                            : false
                        }
                        navigation={{
                          prevEl: ".custom-prev",
                          nextEl: ".custom-next",
                        }}
                        pagination={{
                          type: "fraction",
                          el: ".custom-pagination",
                        }}
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper;

                          // ✅ VERY IMPORTANT
                          setTimeout(() => {
                            swiper.navigation.init();
                            swiper.navigation.update();
                            swiper.autoplay?.start();
                          }, 0);
                        }}
                        onSlideChange={(swiper) => {
                          setCurrentIndex(swiper.realIndex);
                        }}
                        className="w-full h-80 md:h-96"
                      >
                        {listingPhoto.map((src, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={src}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={openGalleryModal}
                            />
                          </SwiperSlide>
                        ))}

                        {listingPhoto.length > 1 && (
                          <>
                            <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg transition-all">
                              <FaChevronLeft />
                            </button>
                            <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg transition-all">
                              <FaChevronRight />
                            </button>
                          </>
                        )}

                        <button
                          onClick={openGalleryModal}
                          className="absolute bottom-4 right-4 z-10 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all"
                        >
                          <FaExpand />
                        </button>
                      </Swiper>
                    )}
                  </div>

                  {/* Thumbnails - Kept exactly the same UI */}
                  {listingPhoto.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {listingPhoto.map((src, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              swiperRef.current?.slideToLoop(index)
                            }
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentIndex
                                ? "border-[#2B2BD9]"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={src}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Description */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaHome className="text-[#2B2BD9]" />
                    Property Description
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {getDescription()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Details & Actions */}
              <div className="space-y-6">
                {/* Quick Details Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Property Details
                  </h3>

                  <div className="space-y-4">
                    {/* 1. Area - Always Visible */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BiArea className="text-[#2B2BD9] text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Area</p>
                        <p className="font-semibold">{getAreaFormatted()}</p>
                      </div>
                    </div>

                    {/* 2. Location - Always Visible */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FaMapMarked className="text-[#2B2BD9] text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <a
                          href={getLocationLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#2B2BD9] hover:underline"
                        >
                          {getLocationTitle()}
                        </a>
                      </div>
                    </div>

                    {isLayout && project?.startingPlotSize && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FaThLarge className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Starting Plot Size
                          </p>
                          <p className="font-semibold">
                            {getStartingPlotSizeFormatted()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 3. Conditional Plots - Only for Layouts/Plots */}
                    {(isPlot || isLayout) && project?.plotNumber && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FaThLarge className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {isPlot ? "Plot Number" : "Number of Plots"}
                          </p>
                          <p className="font-semibold">{getPlotNumber()}</p>
                        </div>
                      </div>
                    )}

                    {/* 4. Conditional BHK - Only for Houses/Villas/Apartments */}
                    {isHome && project?.bhk && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BiBed className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Configuration</p>
                          <p className="font-semibold">
                            {getBHK()} BHK
                            {project.balcony && " • Balcony"}
                            {project.terrace && " • Terrace"}
                          </p>
                        </div>
                      </div>
                    )}

                    {project.approvalType?.length !== 0 && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FaCheckCircle className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Approval Type</p>
                          <p className="font-semibold">
                            {project.approvalType?.join(" , ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floor Plan Card */}
                {getFloorImageUrl() && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      {isLayout ? "Master Plan" : "Floor Plan"}
                    </h3>
                    <div
                      className="relative rounded-lg overflow-hidden cursor-pointer group mb-4"
                      onClick={openModal}
                    >
                      <img
                        src={getFloorImageUrl()}
                        alt="Floor Plan"
                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full">
                          <FaExpand className="text-gray-800" />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={openModal}
                      className="w-full text-center text-[#2B2BD9] font-semibold hover:text-blue-700 transition-colors"
                    >
                      {isLayout
                        ? "View Full Master Plan →"
                        : "View Full Floor Plan →"}
                    </button>
                  </div>
                )}

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-[#2B2BD9] to-blue-600 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Interested in this Property?
                  </h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        openContact(true);
                        setTimeout(() => {
                          contactRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <FaPhoneAlt className="mr-2 text-xl" />
                      Contact Us for Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            {contact && (
              <div
                ref={contactRef}
                className="mt-10 bg-gradient-to-r from-[#E9E9FB] to-blue-50 rounded-2xl p-8 shadow-lg"
              >
                <div className="max-w-4xl mx-auto">
                  {/* Heading */}
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Contact Us
                  </h2>
                  <p className="text-center text-gray-600 mb-10">
                    Get in touch with us for site visit, pricing & full details
                  </p>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Call */}
                    <a
                      className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-200"
                      href="tel:+919962999658"
                    >
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaPhoneAlt className="text-[#2B2BD9] text-2xl" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="text-lg font-bold text-gray-800 hover:text-[#2B2BD9]">
                          +91 99629 99658
                        </p>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:contact@srisairam.co.in"
                      className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-200"
                    >
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaEnvelope className="text-[#2B2BD9] text-2xl" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-lg font-bold text-gray-800 hover:text-[#2B2BD9]">
                          contact@srisairam.co.in
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Properties */}
            {project && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Similar Properties
                </h2>
                <Alsolike id={project._id} />
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#2B2BD9] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading property details...</p>
          </div>
        )}
      </Layout>

      <Footer />
    </>
  );
};

export default ProjectDetail;
