// src/pages/admin/Projects.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import Loader from "../../component/Loader";

const AdminProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // For client-side search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  fetchProjects(currentPage);
}, [currentPage, searchTerm]);


  useEffect(() => {
  const delay = setTimeout(() => {
    setCurrentPage(1);
  }, 400);

  return () => clearTimeout(delay);
}, [searchTerm]);



  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);

      const res = await API.get("/projects/paginated", {
        params: {
          page,
          limit: itemsPerPage,
          admin: "true",
          search: searchTerm || undefined,
        },
      });

      if (res.data.status) {
        setProjects(res.data.projects);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish/Unpublish (live status)
  const handleToggleLive = async (id, currentLive) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          currentLive ? "unpublish" : "publish"
        } this project?`
      )
    )
      return;

    try {
      const res = await API.post("/projects/update", {
        _id: id,
        formFields: JSON.stringify({ live: !currentLive }),
      });

      if (res.data.status) {
        toast.success(`Project ${!currentLive ? "published" : "unpublished"}!`);
        fetchProjects(currentPage); // Refresh list
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await API.post("/projects/delete", { _id: id });
      toast.success("Project deleted successfully");
      fetchProjects(currentPage);
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  

  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      {/* Header + Search + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800">
          Manage Projects
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by title, category, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86] focus:border-[#F5BE86]"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Add New Button */}
          <button
            onClick={() => navigate("/admin/projects/new")}
            className="bg-[#F5BE86] hover:bg-[#e0a76f] text-white px-6 py-2.5 rounded-lg font-medium shadow transition w-full sm:w-auto"
          >
            + Add New Project
          </button>
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader text="Loading projects..." />
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category / Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price / Area
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={project.thumbnail?.url || project.thumbnail}
                      alt={project.title}
                      className="h-16 w-24 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium line-clamp-1 text-gray-900">
                      {project.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {project.category || "-"}
                    </div>
                    <div className="text-xs mt-1 space-x-1">
                      {project.live ? (
                        <span className="text-green-600 font-medium">Live</span>
                      ) : (
                        <span className="text-gray-500">Draft</span>
                      )}
                      {" • "}
                      {/* {project.approved === "approved" ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-orange-600">Pending</span>
                      )} */}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ₹{Number(project.price).toLocaleString("en-IN")}
                    <br />
                    <span className="text-xs text-gray-500">
                      {project.totalArea} {project.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {project.view || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/projects/edit/${project._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleToggleLive(project._id, project.live)
                        }
                        className={`p-2 rounded transition ${
                          project.live
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={project.live ? "Unpublish" : "Publish"}
                      >
                        {project.live ? (
                          <FaTimes size={18} />
                        ) : (
                          <FaCheck size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader text="Loading projects..." />
          </div>
        )}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <img
                src={project.thumbnail?.url || project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 truncate">
                  {project.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <br />₹{Number(project.price).toLocaleString("en-IN")}
                  </div>
                  <div>
                    <span className="text-gray-500">Area:</span>
                    <br />
                    {project.totalArea} {project.unit}
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <br />
                    {project.live ? "Live" : "Draft"}
                  </div>
                  <div>
                    <span className="text-gray-500">Views:</span>
                    <br />
                    {project.view || 0}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/projects/edit/${project._id}`)
                    }
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleToggleLive(project._id, project.live)}
                    className={`flex-1 py-2 rounded-lg text-white transition flex items-center justify-center gap-2 ${
                      project.live
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {project.live ? <FaTimes /> : <FaCheck />}
                    {project.live ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-gray-300 transition"
          >
            <FaArrowLeft size={14} /> Prev
          </button>

          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-gray-300 transition"
          >
            Next <FaArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Arrow Icons for Pagination
const FaArrowLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const FaArrowRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default AdminProjects;
