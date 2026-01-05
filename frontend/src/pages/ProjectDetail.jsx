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
  FaLandmark,
  FaLocationArrow,
  FaPoundSign,
  FaRupeeSign,
  FaMagento,
  FaMap,
  FaMapPin,
  FaMapSigns,
  FaThLarge,
  FaLayerGroup,
  FaChartBar,
} from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaUserCircle, FaHeart } from "react-icons/fa";
import Footer from "../component/homepage/Footer";
import { useSelector } from "react-redux";
import API from "../utils/API";
import { useNavigate } from "react-router-dom";
import Share from "../component/models/Share";
import founder from "../assets/founder.png";
import toast from "react-hot-toast";
import Loading from "../component/Loading";
import Alsolike from "../component/Alsolike";
import Layout from "../component/layout/Layout";
const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Images");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [project, setProject] = useState(null);
  const [shareModel, setShareModel] = useState(false);
  const [listingPhoto, setListingPhot] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
    const call = async () => {
      try {
        const data = await API.post("/projects/getProject", {
          _id: id,
        });
        if (data.data.status) {
          setProject(data.data.project);
          console.log(data.data.project._id);

          const project = data.data.project;

          const photos = [
            ...project.listingPhotoPaths,
            project.thumbnail,
            ...(project.floorImage ? [project.floorImage] : []),
          ];

          setListingPhot(photos);
          console.log(photos)

          console.log(data.data.project.locationLink);
          setListingPhot(photos);
        } else {
          console.log(data.data.message);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (location) {
      call();
    }
  }, []);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const response = await API.get(`/wishlist/getWishlist`, {
          params: { userId: user._id, listingId: id },
        });
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist status", error);
      }
    };

    fetchWishlistStatus();
  }, [id]);
  const handleWishlistToggle = async () => {
    try {
      const response = await API.post(`/wishlist/postWishlist`, {
        userId: user._id,
        listingId: id,
      });
      navigate("/projects");
      if (response.data.success) {
        setIsInWishlist(!isInWishlist);
        toast.success("Updated the wishlist wishlist");
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };
  const [contact, openContact] = useState(false);

  return (
    <>
      <Navbar />
      <Layout
        title={`${project ? project.title : "Project"} - SRI SAI ESTATE`}
        description={`Explore ${project?.title} – ${
          project?.unit === "sqft"
            ? `${project?.totalArea} Sq.ft `
            : project?.unit === "Acre"
            ? `${project?.totalArea} Acre`
            : `${project?.totalArea} Cents`
        } located in ${
          project?.locationTitle
        }. Get complete details including price, floor plans, amenities, and more.`}
        keywords={`${project?.title}, real estate in ${
          project?.locationTitle
        }, ${
          project?.unit === "sqft"
            ? `${project?.totalArea} Sq.ft `
            : project?.unit === "Acre"
            ? `${project?.totalArea} Acre`
            : `${project?.totalArea} Cents`
        }], project floor plans, project brochure, real estate investment`}
      >
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
                onClick={closeModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Full-screen image */}
              <img
                src={project.floorImage}
                alt="Floor Plan"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
        {shareModel && (
          <Share
            setShareModel={setShareModel}
            image={project.thumbnail.url || project.thumbnail}
            title={project.title}
            url={`https://srisairam.co.in/projectDetail/${project.title}/${project._id}`}
          />
        )}
        {/* Background Section */}
        <div
          className="w-full min-h-72 max-h-72 inset-0  bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-4 md:pl-14 text-white">
            <h1 className="text-4xl fira-sans">Projects</h1>
            <p className="text-xl font-[Montserrat]">
              <span
                onClick={() => navigate("/")}
                className="border-b-2 cursor-pointer"
              >
                Home
              </span>{" "}
              {">"}{" "}
              <span
                className="border-b-2 hover:cursor-pointer "
                onClick={() => navigate("/projects")}
              >
                Projects
              </span>{" "}
              {`>`} <span>Project Detail</span>
            </p>
          </div>
        </div>

        {project ? (
          <div className="bg-white w-full md:w-[95%] mx-auto rounded-lg overflow-hidden  p-5 md:p-8 mt-5">
            {/* Header Section */}
            <div className="mb-4 flex justify-between items-center ">
              <h1 className="text-lg md:text-xl font-bold font-[Montserrat]">
                {project?.title}
              </h1>
              <div className="flex gap-4 items-center">
                <FaShareAlt
                  onClick={() => setShareModel(true)}
                  className="hover:cursor-pointer text-gray-600 hover:text-blue-500 transition-colors duration-200"
                />
                {/* <FaHeart
                  onClick={() => {
                    user !== null ? handleWishlistToggle() : navigate("/login");
                  }}
                  className={`cursor-pointer text-xl ${
                    isInWishlist ? "text-red-500" : "text-gray-400"
                  } hover:scale-110 transition-transform duration-200`}
                /> */}
              </div>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Section */}
              <div className="w-full md:w-[50%] ">
                <img
                  src={project.thumbnail.url || project.thumbnail}
                  alt={project.title}
                  className="w-full h-60 md:h-80 inset-0 object-center"
                />
                <div className="mt-4  text-start ">
                  <h3 className="  mb-3 flex gap-2 text-2xl font-semibold items-center ">
                    <FaHome />
                    {project.title}
                  </h3>
                  <p className=" flex gap-2 items-center mt-2  font-thin ">
                    <FaMapMarkerAlt className="text-xl" />{" "}
                    <a
                      href={project.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black flex gap-1"
                    >
                      Location :{" "}
                      <p className="underline hover:underline">
                        {project.locationTitle}
                      </p>
                    </a>
                  </p>

                  <p className=" mt-2 flex gap-2 items-center font-thin  pl-[0.5px] ">
                    <FaMapMarked className="text-xl" />
                    Project Size :{"  "}
                    {project.unit === "sqft"
                      ? `${project.totalArea} Sq.ft `
                      : project.unit === "Acre"
                      ? `${project.totalArea} Acre`
                      : `${project.totalArea} Cents`}
                  </p>

                  <p className=" flex gap-2 items-center mt-2  font-thin ">
                    <FaThLarge className="text-xl" />{" "}
                    <a
                      href={project.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black flex gap-1"
                    >
                      Number of plots : {project.plotNumber}
                    </a>
                  </p>
                  <p className="mt-2 flex gap-2 items-center font-thin">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 25 25"
                      fill="none"
                      className="mt-1 relative -left-[2px]"
                    >
                      <g
                        id="gis:location-man"
                        clip-path="url(#clip0_2521_12329)"
                      >
                        <path
                          id="Vector"
                          d="M12.45 5.89795C10.4915 5.8982 8.55103 6.73995 8.75503 8.42195L9.25503 12.0779C9.34278 12.7212 9.77753 13.7499 10.4268 13.7499H10.473L11.0048 19.8827C11.0278 20.1587 11.2278 20.3827 11.5048 20.3827H13.5048C13.7818 20.3827 13.9818 20.1587 14.0048 19.8827L14.5365 13.7499H14.583C15.2323 13.7499 15.6668 12.7212 15.7548 12.0782L16.2548 8.4217C16.3858 6.73845 14.4088 5.89745 12.45 5.89795Z"
                          fill="black"
                        />
                        <path
                          id="Vector_2"
                          d="M12.5061 12.7271L12.4941 12.7586C12.4981 12.7491 12.5009 12.7393 12.5049 12.7298L12.5061 12.7271Z"
                          fill="black"
                        />
                        <path
                          id="Vector_3"
                          d="M12.5 5.25C13.9497 5.25 15.125 4.07475 15.125 2.625C15.125 1.17525 13.9497 0 12.5 0C11.0503 0 9.875 1.17525 9.875 2.625C9.875 4.07475 11.0503 5.25 12.5 5.25Z"
                          fill="black"
                        />
                        <path
                          id="Vector_4"
                          d="M15.2305 17.2729C15.2093 17.5159 15.1867 17.7584 15.1655 18.0014C17.4035 18.3174 19.0625 19.0344 19.25 19.9214C19.5292 21.2404 15.2145 21.8339 12.435 21.8062C9.6555 21.7784 5.42025 21.2404 5.7905 19.9212C6.0335 19.0554 7.6685 18.3527 9.848 18.0254C9.82625 17.7817 9.8015 17.5379 9.7805 17.2944C6.979 17.6034 4.645 18.3642 3.7125 19.3559H0.55725L0 20.5117H3.2915C3.54725 21.8717 6.39825 23.0457 10.475 23.3422L10.3355 24.9999H14.3705L14.33 23.3424C18.4275 23.0457 21.3592 21.8717 21.7085 20.5117H25L24.5225 19.3559H21.3673C20.4815 18.3392 18.1052 17.5659 15.2305 17.2729Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2521_12329">
                          <rect width="25" height="25" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Starting Plot size: {"  "}
                    {project.plot}
                  </p>
                  {project.category === "house" && (
                    <p className="mt-2 mb-2 flex gap-2 items-center font-thin relative -left-[0.9px]">
                      <BiBed className="text-2xl " /> {project.bhk} BHK -{" "}
                      {project.balcony && "Balcony"},{" "}
                      {project.terrace && "Terrace"}
                    </p>
                  )}

                  <p className="  flex gap-3 items-center pl-1 ">
                    <p className="text-2xl ">₹</p>
                    <p className="font-thin">
                      {Number(project.price).toLocaleString("en-IN")}
                    </p>
                  </p>

                  <button
                    className="mont mt-5 border-2 flex items-center rounded-sm border-blue-500 px-5 py-2 font-medium text-blue-600 "
                    onClick={() => {
                      const gallerySection = document.getElementById("gallery");
                      gallerySection.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    View Site Gallery <FaArrowRight className="ml-3" />
                  </button>
                  <div className="max-w-[90%] mt-4">
                    <h4 className="text-gray-800 font-medium mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 text-sm md:text-base font-[Montserrat] leading-relaxed whitespace-pre-line">
                      {project.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section */}

              <div className="w-full md:w-[50%] flex justify-center items-top">
                {project?.floorImage && (
                  <img
                    src={project.floorImage.url || project.floorImage}
                    alt="Floor Plan"
                    className="w-full max-h-[450px] object-contain border border-gray-300 p-1"
                    onClick={openModal}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loading className="" />
          </div>
        )}

        <div className="w-[95%] px-5 mdx:-8 mx-auto ">
          <button
            onClick={() => openContact(!contact)}
            className="bg-[#2B2BD9] text-white py-2 my-3 hover:bg-blue-600 transition-colors duration-200 w-[240px] md:w-[466px]"
          >
            Enquiry to Buy Property
          </button>
        </div>

        {contact && (
          <div className="w-full flex justify-center px-4 md:px-8 lg:px-16 mb-5">
            <div className="w-full max-w-5xl bg-[#E9E9FB] border-2 border-gray-400  shadow-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-400">
                <div className="flex items-center space-x-2">
                  {/* <FaUserCircle className="text-xl md:text-3xl" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g id="mdi:support">
                      <path
                        id="Vector"
                        d="M18.72 14.7607C19.07 13.9107 19.26 13.0007 19.26 12.0007C19.26 11.2807 19.15 10.5907 18.96 9.95068C18.31 10.1007 17.63 10.1807 16.92 10.1807C15.466 10.1822 14.0329 9.8342 12.7415 9.1659C11.4502 8.4976 10.3384 7.52863 9.5 6.34068C8.60396 8.51142 6.91172 10.2573 4.77 11.2207C4.73 11.4707 4.73 11.7407 4.73 12.0007C4.73 12.9554 4.91804 13.9008 5.2834 14.7828C5.64875 15.6648 6.18425 16.4663 6.85933 17.1413C8.22272 18.5047 10.0719 19.2707 12 19.2707C13.05 19.2707 14.06 19.0407 14.97 18.6307C15.54 19.7207 15.8 20.2607 15.78 20.2607C14.14 20.8107 12.87 21.0807 12 21.0807C9.58 21.0807 7.27 20.1307 5.57 18.4207C4.53505 17.3906 3.76627 16.1242 3.33 14.7307H2V10.1807H3.09C3.42024 8.57319 4.17949 7.08509 5.28719 5.87427C6.39489 4.66345 7.80971 3.77509 9.38153 3.30344C10.9534 2.83179 12.6235 2.79445 14.2149 3.19539C15.8062 3.59632 17.2593 4.42057 18.42 5.58068C19.6798 6.83626 20.5393 8.43696 20.89 10.1807H22V14.7307H21.94L18.38 18.0007L13.08 17.4007V15.7307H17.91L18.72 14.7607ZM9.27 11.7707C9.57 11.7707 9.86 11.8907 10.07 12.1107C10.281 12.3234 10.3995 12.611 10.3995 12.9107C10.3995 13.2104 10.281 13.4979 10.07 13.7107C9.86 13.9207 9.57 14.0407 9.27 14.0407C8.64 14.0407 8.13 13.5407 8.13 12.9107C8.13 12.2807 8.64 11.7707 9.27 11.7707ZM14.72 11.7707C15.35 11.7707 15.85 12.2807 15.85 12.9107C15.85 13.5407 15.35 14.0407 14.72 14.0407C14.09 14.0407 13.58 13.5407 13.58 12.9107C13.58 12.6083 13.7001 12.3184 13.9139 12.1046C14.1277 11.8908 14.4177 11.7707 14.72 11.7707Z"
                        fill="black"
                      />
                    </g>
                  </svg>
                  <span className="font-semibold text-lg md:text-2xl mont">
                    Contact
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row items-center px-6 md:px-12 py-8 gap-y-6 md:gap-x-12">
                {/* Image Placeholder */}
                {/* <div className="w-24 h-24  bg-gray-300 overflow-hidden">
                  <img
                    src={founder}
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <p className="text-lg md:text-xl font-semibold text-gray-800 fira-sans">
                    {name || "K SURESH BABU"}
                  </p>
                  <p className="text-sm text-gray-600 font-[Montserrat]">
                    Property Seller
                  </p>
                </div> */}

                {/* Contact Info */}
                <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-12 w-full md:w-auto">
                  {/* Phone */}
                  <div className="flex flex-col items-center md:items-start">
                    <strong className="text-[#2B2BD9]">Mobile Number:</strong>
                    <span className="text-gray-900 flex items-center gap-2 font-medium text-sm md:text-base font-[Montserrat]">
                      <FaPhoneAlt className="text-black" /> {"+91 9962999658"}
                    </span>
                  </div>
                  {/* Email */}
                  <div className="flex flex-col items-center md:items-start">
                    <strong className="text-[#2B2BD9]">Email:</strong>
                    <span className="text-gray-900 font-medium flex items-center gap-2 text-sm md:text-base font-[Montserrat]">
                      <FaEnvelope className="text-black" />{" "}
                      {"contact@srisairam.co.in"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto p-6">          

          {/* Main Image Slider */}
          {project && (
            <div id="gallery">
              <div className="w-full flex justify-center">
                <div className="relative w-[80%] md:w-[60%] overflow-visible">
                  <img
                    src={listingPhoto[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                    className="w-full object-center"
                  />
                  {/* Left Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-2 shadow-lg hover:bg-blue-700 focus:outline-none"
                  >
                    &#x276E;
                  </button>
                  {/* Right Button */}
                  <button
                    onClick={handleNext}
                    className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-2 shadow-lg hover:bg-blue-700 focus:outline-none"
                  >
                    &#x276F;
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center mt-6 gap-2">
                {listingPhoto.map((src, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={src.url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`h-20 w-28 object-cover border-2 ${
                        index === currentIndex
                          ? "border-blue-600"
                          : "border-transparent"
                      }`}
                    />
                    {index === project.listingPhotoPaths.length - 1 &&
                      project.listingPhotoPaths.length > 6 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-lg">
                          +{project.listingPhotoPaths.length - 6}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {project && <Alsolike id={project._id} />}
      </Layout>

      <Footer />
    </>
  );
};

export default ProjectDetail;
