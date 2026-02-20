import React, { useEffect, useState } from "react";
import Navbar from "../component/homepage/Navbar";
import background from "../assets/project.jpeg";
import ProjectCard from "../component/cards/ProjectCard";
import toast from "react-hot-toast";
import API from "../utils/API";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Share from "../component/models/Share";
import Loading from "../component/Loading";
import { FaList } from "react-icons/fa";
import { BsGrid3X3GapFill } from "react-icons/bs";
import Footer from "../component/homepage/Footer";
import Layout from "../component/layout/Layout";
import SEO from "../component/SEO";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    area: "",
    category: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'list' or 'grid'

  // Toggle view mode between list and grid
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Fetch projects with filters and pagination
  const fetchProjects = async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      // Prepare query params
      const params = {
        page,
        sort,
        limit: pagination.itemsPerPage,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response = await API.get("/projects/paginated", { params });

      if (response.data.status) {
        setProjects(response.data.projects);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          currentPage: page,
        }));
      } else {
        toast.error("Failed to load projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjects(1);
  }, []);

  useEffect(() => {
    fetchProjects(1, filters);
  }, [sort, filters]);

  const handleSortChange = (value) => {
  setSort(value);
};

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects(1, filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      area: "",
      category: "",
    });
    fetchProjects(1);
    toast.success("Filters reset successfully");
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProjects(page, filters);
      // Scroll to top of products section
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };


  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (pagination.totalPages <= 1) return null;     

    // Calculate start and end pages
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded ${
            pagination.currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          {pagination.totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <>
      <Navbar />

      <SEO
        title="Current Projects & Available Plots | Sri Sai Ram Real Estate"
        description="Browse our latest real estate projects including gated communities, open plots, and ready-to-move houses. Invest in your future with our verified properties."
        keywords="available plots, ongoing real estate projects, investment properties, gated community plots, ready to construct houses"
        url="https://srisairam.co.in/projects"
      />

      {/* Background Section */}
      <Layout
        title={"Projects - SRI SAI ESTATE"}
        description={
          "Discover top residential and commercial real estate projects in your city. Browse upcoming and ready-to-move projects from trusted developers, all in one place."
        }
        keywords={
          "real estate projects, residential projects, commercial properties, upcoming projects, ready to move flats, new construction homes"
        }
      >
        <div
          className="w-full min-h-72 max-h-72 inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-14 text-white">
            <h1 className="text-4xl fira-sans">Projects</h1>
            <p className="text-xl font-[Montserrat]">
              <span
                className="hover:cursor-pointer border-b-2"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              {`>`} <span>Projects</span>
            </p>
          </div>
        </div>

        {/* Heading with View Toggle */}
        <div className="w-full flex justify-between items-center px-4 md:px-14 mt-10">
          <h1 className="font-bold mont text-2xl md:text-4xl">
            Finding projects you may like
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => toggleViewMode("list")}
              className={`p-2 ${
                viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
              } rounded hidden md:block`}
              aria-label="List view"
            >
              <FaList className="h-6 w-6" />
            </button>
            <button
              onClick={() => toggleViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"
              } rounded hidden md:block`}
              aria-label="Grid view"
            >
              <BsGrid3X3GapFill className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-2">
              <div className="flex flex-col">
                <label
                  htmlFor="search"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Project name"
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Property Type
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">All Categories</option>
                  <option value="residential_group">Residential Plots</option>
                  <option value="commercial_group">Commercial Plots</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">House/Villa</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Project Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="p-3 border border-gray-300 rounded-md bg-white
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="newly-launched">Newly Launched</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="minPrice"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Min Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="maxPrice"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Any"
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="area"
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Area (sq.ft)
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={filters.area}
                  onChange={handleFilterChange}
                  placeholder="Min area"
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => resetFilters()}
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <p className="text-gray-600">
                Showing {projects.length} of {pagination.totalItems} properties
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 md:hidden">
                <button
                  onClick={() => toggleViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } rounded`}
                  aria-label="List view"
                >
                  <FaList className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } rounded`}
                  aria-label="Grid view"
                >
                  <BsGrid3X3GapFill className="h-5 w-5" />
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-white min-w-[180px]"
              >
                <option value="">Sort by</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Property Cards Section */}
              <div className="mb-8">
                {projects.length > 0 ? (
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "flex flex-col space-y-6"
                    }`}
                  >
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project._id || index}
                        product={project}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 mb-4"
                    >
                      <path d="M10.5 21.5L14.5 16.5L19 21.5" />
                      <path d="M21 15V7.5C21 6.39543 20.1046 5.5 19 5.5H5C3.89543 5.5 3 6.39543 3 7.5V15" />
                      <rect x="3" y="3.5" width="18" height="18" rx="2" />
                      <line x1="7" y1="9.5" x2="17" y2="9.5" />
                      <line x1="7" y1="13.5" x2="12" y2="13.5" />
                    </svg>
                    <p className="text-center text-xl font-semibold text-gray-700 mb-2">
                      No properties found
                    </p>
                    <p className="text-gray-500 text-center max-w-md">
                      {filters.search || filters.category || filters.status
                        ? "Try adjusting your filters or browse all properties"
                        : "No properties available at the moment. Check back soon!"}
                    </p>
                    {(filters.search || filters.category || filters.status) && (
                      <button
                        onClick={() => resetFilters()}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                      >
                        View All Properties
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">{renderPagination()}</div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    {pagination.totalItems} properties total
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>

      <Footer />
    </>
  );
};

export default Projects;
