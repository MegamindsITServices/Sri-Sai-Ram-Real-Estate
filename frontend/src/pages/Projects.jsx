import React, { useEffect, useState } from 'react';
import Navbar from '../component/homepage/Navbar';
import background from '../assets/project.jpeg';
import ProjectCard from '../component/cards/ProjectCard';
import toast from 'react-hot-toast';
import API from '../utils/API';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Share from '../component/models/Share';
import Loading from '../component/Loading';
import { FaList } from 'react-icons/fa';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import Footer from '../component/homepage/Footer';
import Layout from '../component/layout/Layout';
import SEO from '../component/SEO';

const Projects = () => {
  const [products, setProducts] = useState(null);
  const [shareModel, setShareModel] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: '',
    bhk: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    category: ''
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('default');
  const itemsPerPage = 15;

  // Toggle view mode between list and grid
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await API.get('/projects/getAll');
        setProducts(data.data.courses);
        console.log(data.data.courses);
      } catch (err) {
        console.log(err.message);
        toast.error('Failed to load projects');
      }
    };
    fetchProducts();
  }, []);

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      status: '',
      bhk: '',
      minPrice: '',
      maxPrice: '',
      area: '',
      category: ''
    });
    setCurrentPage(1);
    setSortOption('default');
    toast.success('Filters reset successfully');
  };

  // Apply filters function
  const applyFilters = () => {
    // This is already working automatically through the filter state
    // Just adding a confirmation toast
    toast.success('Filters applied');
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  // Filter and sort products
  let filteredProducts = null;
  let currentProducts = null;
  let totalPages = 0;

  if (products !== null) {
    // Filter products
    filteredProducts = products?.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesStatus = filters.status ? product.status === filters.status : true;
      const matchesBHK = filters.bhk ? product.bhk.includes(filters.bhk) : true;
      const matchesPrice = (filters.minPrice ? parseInt(product.price.replace(/,/g, '')) >= parseInt(filters.minPrice) : true) &&
                           (filters.maxPrice ? parseInt(product.price.replace(/,/g, '')) <= parseInt(filters.maxPrice) : true);
      const matchesArea = filters.area ? product.Acre.toLowerCase().includes(filters.area.toLowerCase()) : true;
      const matchesCategory = filters.category ? product.category === filters.category : true;
      return matchesSearch && matchesStatus && matchesBHK && matchesPrice && matchesArea && matchesCategory;
    });

    // Sort products
    if (sortOption !== 'default') {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/,/g, ''));
        const priceB = parseInt(b.price.replace(/,/g, ''));
        
        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'newest':
            // Assuming there's a date field, otherwise this won't work properly
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default:
            return 0;
        }
      });
    }

    // Pagination
    totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  }

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
        <div className="w-full flex justify-between items-center px-14 mt-10">
          <h1 className="font-bold mont text-4xl">
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
        {products ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Filter Section with Shadow and Better Layout */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="searchQuery"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    id="searchQuery"
                    name="searchQuery"
                    value={filters.searchQuery}
                    onChange={handleFilterChange}
                    placeholder="Project name or keyword"
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Availability
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="">All Status</option>
                    <option value="available">Available Plots</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
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
                    <option value="residential">Residential Plots</option>
                    <option value="commercial">Commercial Plots</option>
                    <option value="house">Houses</option>
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
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => resetFilters()}
                  className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  Reset
                </button>
                {/* <button 
                onClick={() => applyFilters()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Apply Filters
              </button> */}
              </div>
            </div>

            {/* Property Cards Section with View Mode */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {/* {filteredProducts?.length || 0} properties found */}
                  {filters.searchQuery && ` for "${filters.searchQuery}"`}
                </p>
                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOption}
                  className="p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  {/* <option value="newest">Newest First</option> */}
                </select>
              </div>

              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col space-y-4"
                }`}
              >
                {currentProducts && currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <ProjectCard
                      key={index}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 mb-4"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <p className="text-center text-lg font-medium text-gray-700">
                      No properties match your criteria
                    </p>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your filters or browse all properties
                    </p>
                    <button
                      onClick={() => resetFilters()}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    // Show first page, last page, current page and one page before and after current
                    if (
                      index === 0 ||
                      index === totalPages - 1 ||
                      (index >= currentPage - 2 && index <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    } else if (
                      (index === 1 && currentPage > 3) ||
                      (index === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center py-24 bg-gray-50">
            <Loading className="mb-4" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        )}
      </Layout>

      <Footer />
    </>
  );
};

export default Projects;