// src/pages/admin/Projects.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../component/Loader";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await API.get("/projects/getAll/admin");
        setProjects(response.data.courses || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await API.post("/projects/delete", { _id: id });
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  // Placeholder for toggle live/approved (you can expand later)
  const handleToggleStatus = async (id, field, currentValue) => {
    try {
      // You would need backend endpoint to toggle these fields
      // For now just frontend simulation
      setProjects(
        projects.map((p) =>
          p._id === id ? { ...p, [field]: !currentValue } : p
        )
      );
      toast.success(`Project ${field} updated`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <Loader text="Loading projects..." />
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800">
          Manage Projects
        </h1>

        <button
          onClick={() => navigate("/admin/projects/new")} // you'll create this later
          className="bg-[#FFC13B] hover:bg-[#e0a76f] text-white px-5 py-2.5 rounded-lg font-medium shadow transition"
        >
          + Add New Project
        </button>
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category / Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price / Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {project.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {project.category || "-"}
                    </div>
                    <div className="text-xs mt-1">
                      {project.live ? (
                        <span className="text-green-600">Live</span>
                      ) : (
                        <span className="text-gray-500">Draft</span>
                      )}
                      {" • "}
                      {project.approved === "approved" ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-orange-600">Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{Number(project.price).toLocaleString("en-IN")}
                    <br />
                    <span className="text-xs">
                      {project.totalArea} {project.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.view || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/projects/edit/${project._id}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium 
               text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700
               transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium 
               text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700
               transition"
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
      <div className="md:hidden space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {project.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
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

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/projects/edit/${project._id}`)
                    }
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
