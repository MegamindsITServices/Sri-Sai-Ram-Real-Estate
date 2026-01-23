import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { ToggleSearch } from "../../redux/Toggle";
import { FaMapMarkerAlt, FaHome, FaMap, FaShareAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import stickerImage from "../../assets/Star 6.png";
import sold from "../../assets/sold.png";
import { X } from "lucide-react";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Pagination States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // UI States
  const placeholders = ["Name", "Location"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setAnimate(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/projects/paginated", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch || undefined,
        },
      });

      if (response.data.status) {
        setProducts(response.data.projects);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error(`Search Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const close = () => {
    dispatch(ToggleSearch());
  };

  const handleCardClick = (item) => {
    close();
    navigate(`/projectDetail/${encodeURIComponent(item.title)}/${item._id}`, {
      state: item,
    });
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={close}
    >
      <div
        className="bg-gray-50 w-full max-w-4xl max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Search Bar */}
        <div className="p-6 bg-white border-b sticky top-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold fira-sans text-gray-800 uppercase tracking-tight">
              Search Properties
            </h2>
            <button
              onClick={close}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              autoFocus
              className="w-full outline-none px-4 py-3 border-2 border-gray-300 font-[Montserrat] focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!search && (
              <div className="absolute left-5 text-gray-400 pointer-events-none flex items-center">
                Find By{" "}
                <span
                  className={`ml-2 inline-block transition-all duration-500 ${
                    animate
                      ? "-translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  {placeholders[placeholderIndex]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loading />
            </div>
          ) : products.length > 0 ? (
            products.map((item) => (
              <div
                key={item._id}
                onClick={() => handleCardClick(item)}
                className="border shadow-lg p-4 bg-white relative hover:cursor-pointer flex flex-col md:flex-row md:gap-4 gap-2 items-stretch transition-all duration-300 hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="w-full md:max-w-[30%] md:min-w-[30%] flex">
                  <div className="w-full h-40 md:h-full bg-gray-100 overflow-hidden">
                    <img
                      src={item.thumbnail?.url || item.thumbnail || "/logo.png"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-2 flex-grow justify-center">
                  <h2 className="text-xl font-bold flex items-center gap-2 font-[firaSans] text-gray-800">
                    <FaHome className="text-black" />{" "}
                    {item.title || "Untitled Property"}
                  </h2>

                  <p className="flex items-center gap-2 font-[Montserrat] text-gray-800 text-sm">
                    <FaMapMarkerAlt className="text-black" />{" "}
                    {item.locationTitle}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-700 font-[Montserrat]">
                    <p className="flex items-center gap-2">
                      <FaMap className="text-black" />
                      <span className="font-medium text-sm">
                        {item.totalArea} {item.unit}
                      </span>
                    </p>
                    {item.bhk && (
                      <p className="flex items-center gap-2">
                        <BiBed className="text-black text-lg" />
                        <span className="text-sm">{item.bhk} BHK</span>
                      </p>
                    )}
                  </div>

                  <p className="font-[Montserrat] font-bold text-lg text-black">
                    ₹ {Number(item.price).toLocaleString("en-IN")}
                  </p>

                  <div className="mt-auto">
                    <span
                      className={`px-2 py-1 text-xs font-semibold ${
                        item.status === "sold-out"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status === "available"
                        ? "Available"
                        : item.status === "upcoming"
                          ? "Upcoming"
                          : item.status === "newly-launched"
                            ? "Newly Launched"
                            : "Sold Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 italic font-[Montserrat]">
              No properties found matching "{search}"
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-white border-t flex justify-center items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-gray-500 font-[Montserrat] uppercase">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
