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

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? listingPhoto.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === listingPhoto.length - 1 ? 0 : prev + 1
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
          isInWishlist ? "Removed from wishlist" : "Added to wishlist"
        );
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi, I'm interested in ${project?.title} property. Please share more details.`;
    const phone = "+919962999658";
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

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

  const getPlotSize = () => {
    return project?.plot || "N/A";
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
                    ₹{getPriceFormatted()}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {getAreaFormatted()}
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
                {/* Main Image with Gallery */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={listingPhoto[currentIndex] || getThumbnailUrl()}
                      alt={`Gallery ${currentIndex + 1}`}
                      className="w-full h-80 md:h-96 object-cover"
                    />

                    {/* Image Count */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {listingPhoto.length}
                    </div>

                    {/* Navigation Arrows */}
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

                    {/* Fullscreen Button */}
                    <button
                      onClick={openGalleryModal}
                      className="absolute bottom-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all"
                      title="View Fullscreen"
                    >
                      <FaExpand />
                    </button>
                  </div>

                  {/* Thumbnails */}
                  {listingPhoto.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {listingPhoto.map((src, index) => (
                          <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentIndex
                                ? "border-[#2B2BD9]"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={src}
                              alt={`Thumbnail ${index + 1}`}
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BiArea className="text-[#2B2BD9] text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Area</p>
                        <p className="font-semibold">{getAreaFormatted()}</p>
                      </div>
                    </div>

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

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FaThLarge className="text-[#2B2BD9] text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Plots Available</p>
                        <p className="font-semibold">{getPlotNumber()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg
                          className="text-[#2B2BD9] text-xl"
                          width="20"
                          height="20"
                          viewBox="0 0 25 25"
                          fill="currentColor"
                        >
                          <g clipPath="url(#clip0)">
                            <path d="M12.45 5.89795C10.4915 5.8982 8.55103 6.73995 8.75503 8.42195L9.25503 12.0779C9.34278 12.7212 9.77753 13.7499 10.4268 13.7499H10.473L11.0048 19.8827C11.0278 20.1587 11.2278 20.3827 11.5048 20.3827H13.5048C13.7818 20.3827 13.9818 20.1587 14.0048 19.8827L14.5365 13.7499H14.583C15.2323 13.7499 15.6668 12.7212 15.7548 12.0782L16.2548 8.4217C16.3858 6.73845 14.4088 5.89745 12.45 5.89795Z" />
                            <path d="M12.5061 12.7271L12.4941 12.7586C12.4981 12.7491 12.5009 12.7393 12.5049 12.7298L12.5061 12.7271Z" />
                            <path d="M12.5 5.25C13.9497 5.25 15.125 4.07475 15.125 2.625C15.125 1.17525 13.9497 0 12.5 0C11.0503 0 9.875 1.17525 9.875 2.625C9.875 4.07475 11.0503 5.25 12.5 5.25Z" />
                            <path d="M15.2305 17.2729C15.2093 17.5159 15.1867 17.7584 15.1655 18.0014C17.4035 18.3174 19.0625 19.0344 19.25 19.9214C19.5292 21.2404 15.2145 21.8339 12.435 21.8062C9.6555 21.7784 5.42025 21.2404 5.7905 19.9212C6.0335 19.0554 7.6685 18.3527 9.848 18.0254C9.82625 17.7817 9.8015 17.5379 9.7805 17.2944C6.979 17.6034 4.645 18.3642 3.7125 19.3559H0.55725L0 20.5117H3.2915C3.54725 21.8717 6.39825 23.0457 10.475 23.3422L10.3355 24.9999H14.3705L14.33 23.3424C18.4275 23.0457 21.3592 21.8717 21.7085 20.5117H25L24.5225 19.3559H21.3673C20.4815 18.3392 18.1052 17.5659 15.2305 17.2729Z" />
                          </g>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Starting Plot Size
                        </p>
                        <p className="font-semibold">{getPlotSize()}</p>
                      </div>
                    </div>

                    {getCategory() === "house" && getBHK() && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BiBed className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Configuration</p>
                          <p className="font-semibold">
                            {getBHK()} BHK
                            {project.balcony && " with Balcony"}
                            {project.terrace && " & Terrace"}
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
                      Floor Plan
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
                      View Full Floor Plan →
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
                      onClick={handleWhatsAppContact}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <FaWhatsapp className="mr-2 text-xl" />
                      WhatsApp Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            {contact && (
              <div className="mt-8 bg-gradient-to-r from-[#E9E9FB] to-blue-50 rounded-2xl p-8 shadow-lg">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaPhoneAlt className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Call Us</h4>
                          <p className="text-gray-600">
                            Direct contact with our team
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        +91 999 666 1234
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaEnvelope className="text-[#2B2BD9] text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Email Us</h4>
                          <p className="text-gray-600">Send us an email</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        badrirocks@gmail.com
                      </p>
                    </div>
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
