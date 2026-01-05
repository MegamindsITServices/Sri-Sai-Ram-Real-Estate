import { useNavigate } from "react-router-dom";
import { FaMapMarked, FaMapMarkerAlt } from "react-icons/fa";

const LikeCard = ({ property }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to detail page
    navigate(
      `/projectDetail/${encodeURIComponent(property.title)}/${property._id}`
    );
    // Smooth scroll to top instead of window.reload for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex-none w-[280px] md:w-1/3 lg:w-1/4 p-2 transition-transform hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200 h-full flex flex-col">
        <div className="relative h-40 overflow-hidden cursor-pointer">
          <img
            src={property.thumbnail?.url || property.thumbnail}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold uppercase text-blue-600 shadow-sm">
            {property.category}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-1 font-sans">
            {property.title}
          </h2>
          <p className="text-xs text-gray-800 flex items-center gap-1 mt-1 font-semibold">
            <FaMapMarkerAlt size={12} className="text-black" />{" "}
            {property.locationTitle}
          </p>
          <p className="text-xs text-gray-800 flex items-center gap-1 mt-1 font-semibold">
            <FaMapMarked size={12} /> {" "}
             Project Size :{" "}
            <span className="uppercase">
              {property.totalArea} {property.unit}
            </span>
          </p>

          <div className="mt-auto pt-4 border-t border-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-blue-600 font-bold">
                ₹{Number(property.price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeCard;
