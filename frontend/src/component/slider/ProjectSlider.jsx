import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../utils/API";
import Loading from "../../component/Loading";
import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProjectSlider = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // For custom navigation buttons
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        setLoading(true);
        const response = await API.get("/projects/top-projects");
        if (response.data.status) {
          setProjects(response.data.projects || []);
        }
      } catch (error) {
        console.error("Slider fetch error:", error);
        toast.error("Failed to load top projects");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#EEEEFC]">
        <Loading />
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="relative w-full p-8 bg-[#EEEEFC]">
      <h2 className="text-2xl md:text-4xl mb-6 fira-sans md:pl-12">
        Our Top Projects
      </h2>

      <div className="relative">
        {/* Left Arrow - same positioning & style as original */}
        <button
          ref={(node) => setPrevEl(node)}
          className="hidden md:block absolute -left-4  top-1/2 -translate-y-1/2 z-10 rounded-lg hover:bg-gray-200 hover:scale-110 text-black py-5 px-2 transition-all flex-shrink-0"
        >
          <svg width="35" height="96" viewBox="0 0 35 96" fill="none">
            <g opacity="0.1">
              <rect
                x="35"
                y="96"
                width="35"
                height="96"
                transform="rotate(-180 35 96)"
                fill="#D9D9D9"
              />
            </g>
            <path
              d="M11.2929 47.2929C10.9024 47.6834 10.9024 48.3166 11.2929 48.7071L17.6569 55.0711C18.0474 55.4616 18.6805 55.4616 19.0711 55.0711C19.4616 54.6805 19.4616 54.0474 19.0711 53.6569L13.4142 48L19.0711 42.3431C19.4616 41.9526 19.4616 41.3195 19.0711 40.9289C18.6805 40.5384 18.0474 40.5384 17.6569 40.9289L11.2929 47.2929ZM14 47L12 47L12 49L14 49L14 47Z"
              fill="#1B1C1E"
            />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          ref={(node) => setNextEl(node)}
          className="hidden md:block absolute -right-4  top-1/2 -translate-y-1/2 z-10 rounded-lg hover:bg-gray-200 hover:scale-110 text-black py-5 px-2 transition-all flex-shrink-0"
        >
          <svg width="35" height="96" viewBox="0 0 35 96" fill="none">
            <g opacity="0.1">
              <rect width="35" height="96" fill="#D9D9D9" />
            </g>
            <path
              d="M23.7071 48.7071C24.0976 48.3166 24.0976 47.6834 23.7071 47.2929L17.3431 40.9289C16.9526 40.5384 16.3195 40.5384 15.9289 40.9289C15.5384 41.3195 15.5384 41.9526 15.9289 42.3431L21.5858 48L15.9289 53.6569C15.5384 54.0474 15.5384 54.6805 15.9289 55.0711C16.3195 55.4616 16.9526 55.4616 17.3431 55.0711L23.7071 48.7071ZM21 49L23 49L23 47L21 47L21 49Z"
              fill="#1B1C1E"
            />
          </svg>
        </button>

        {/* Swiper - minimal padding, same layout sizes as original */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl,
            nextEl,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={projects.length > 1}
          speed={800}
          slidesPerView={1}
          spaceBetween={0} // ← important: no extra gap between slides
          className="overflow-hidden w-full"
        >
          {projects.map((project) => (
            <SwiperSlide key={project._id}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                {/* Image container - exact same classes as original */}
                <div className="w-full md:max-w-[40%] flex-shrink-0">
                  <div className="w-full aspect-[16/9] flex items-center justify-center">
                    <img
                      src={project.thumbnail?.url || project.thumbnail || "/logo.png"}
                      alt={project.title}
                      className="max-w-full max-h-full object-contain rounded-sm shadow-lg"
                    />
                  </div>
                </div>

                {/* Content - exact same classes */}
                <div className="text-center md:text-left w-full md:w-[45%] max-w-lg flex-shrink">
                  <h3 className="text-xl md:text-3xl fira-sans animate-text-shine">
                    {project.title}
                  </h3>
                  <p className="text-sm md:text-lg font-semibold font-[Montserrat] text-gray-800">
                    Location: {project.locationTitle}
                  </p>
                  <p className="text-sm md:text-lg font-semibold font-[Montserrat] text-gray-800">
                    Project Size: {project.totalArea} {project.unit}
                  </p>
                  <p className="text-gray-700 mt-4 text-sm md:text-base font-[Montserrat] line-clamp-3">
                    {project.description}
                  </p>
                  <Link
                    to={`/projectDetail/${encodeURIComponent(project.title)}/${project._id}`}
                    className="mt-4 inline-block bg-[#e57f14]/80 text-white px-6 py-2 rounded-md hover:bg-[#e17f34] transition-colors"
                  >
                    Know More
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile arrows - same as original */}
        <div className="flex mt-6 md:hidden justify-center gap-10">
          <button
            onClick={() => prevEl?.click()}
            className="text-5xl text-gray-800 active:scale-90 transition-transform"
          >
            ‹
          </button>
          <button
            onClick={() => nextEl?.click()}
            className="text-5xl text-gray-800 active:scale-90 transition-transform"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlider;
