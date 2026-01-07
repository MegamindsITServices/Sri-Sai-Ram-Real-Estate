import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../utils/API";
import Loading from "../../component/Loading";

const ProjectSlider = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        setLoading(true);
        const response = await API.get("/projects/paginated", {
          params: {
            limit: 5,
            sort: "price-asc",
            live: "true",
          },
        });

        if (response.data.status) {
          setProjects(response.data.projects);
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#EEEEFC]">
        <Loading />
      </div>
    );
  }

  if (projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  return (
    <div className="relative w-full p-8 bg-[#EEEEFC]">
      <h2 className="text-2xl md:text-4xl mb-6 fira-sans md:pl-12">
        Our Top Projects
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="hidden md:block rounded-lg hover:bg-gray-200 hover:scale-110 text-black py-5 px-2 transition-all flex-shrink-0"
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

        {/* Thumbnail - Aspect Ratio 16/8 Implemented */}
        <div className="w-full md:w-[45%] max-w-[600px] flex-shrink-0">
          <div className="aspect-[16/8] w-full overflow-hidden rounded-lg shadow-lg">
            <img
              src={currentProject.thumbnail?.url || currentProject.thumbnail}
              alt={currentProject.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center md:text-left w-full md:w-[45%] max-w-lg flex-shrink">
          <h3 className="text-xl md:text-3xl fira-sans animate-text-shine">
            {currentProject.title}
          </h3>
          <p className="text-sm md:text-lg font-semibold font-[Montserrat] text-gray-800">
            Location: {currentProject.locationTitle}
          </p>
          <p className="text-sm md:text-lg font-semibold font-[Montserrat] text-gray-800">
            Project Size: {currentProject.totalArea} {currentProject.unit}
          </p>
          <p className="text-gray-700 mt-4 text-sm md:text-base font-[Montserrat] line-clamp-3">
            {currentProject.description}
          </p>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="hidden md:block rounded-lg hover:bg-gray-200 hover:scale-110 text-black py-5 px-2 transition-all flex-shrink-0"
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
      </div>

      {/* MOBILE ARROWS */}
      <div className="flex mt-6 md:hidden justify-center gap-10">
        <button
          onClick={prevSlide}
          className="text-5xl text-gray-800 active:scale-90 transition-transform"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="text-5xl text-gray-800 active:scale-90 transition-transform"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ProjectSlider;
