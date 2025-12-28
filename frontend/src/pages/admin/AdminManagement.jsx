// src/pages/admin/AdminAdmins.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaKey,
  FaTimes,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Loader from "../../component/Loader";

const AdminAdmins = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rowLoadingId, setRowLoadingId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setPageLoading(true);
      const res = await API.get("/admin/admins");
      setAdmins(res.data.admins || []);
    } catch (err) {
      toast.error("Failed to load admins");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Admin Modal Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await API.post("/admin/admins", formData);
      if (res.data.status) {
        toast.success("Admin created successfully!");
        fetchAdmins();
        setShowAddModal(false);
        setShowPassword(false);
        setShowNewPassword(false);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Admin Modal Submit
 const handleEditSubmit = async (e) => {
   e.preventDefault();
   try {
     setActionLoading(true);

     const payload = {
       name: formData.name,
       email: formData.email,
     };

     const res = await API.put(`/admin/admins/${selectedAdmin._id}`, payload);

     if (res.data.status) {
       toast.success("Admin updated successfully!");
       await fetchAdmins();
       setShowEditModal(false);
       setShowPassword(false);
       setShowNewPassword(false);
     }
   } catch (err) {
     toast.error(err.response?.data?.message || "Failed to update admin");
   } finally {
     setActionLoading(false);
   }
 };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);

      const res = await API.put(`/admin/admins/${selectedAdmin._id}/password`, {
        newPassword,
      });

      if (res.data.status) {
        toast.success("Password updated successfully!");
        setShowPasswordModal(false);
        setNewPassword("");
        setShowPassword(false);
        setShowNewPassword(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setActionLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      setRowLoadingId(id);
      await API.delete(`/admin/admins/${id}`);
      toast.success("Admin deleted");
      await fetchAdmins();
    } catch (err) {
      toast.error("Failed to delete admin");
    } finally {
      setRowLoadingId(null);
    }
  };


  const openAddModal = () => {
    setFormData({ name: "", email: "", password: "" });
    setShowAddModal(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading admins..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Admins</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow transition flex items-center gap-2"
        >
          <FaUserPlus /> Add New Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{admin.name}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="text-blue-600 items-center hover:text-blue-800"
                        title="Edit Admin"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => openPasswordModal(admin)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Change Password"
                      >
                        <FaKey /> Password
                      </button>

                      <button
                        onClick={() => handleDelete(admin._id)}
                        disabled={rowLoadingId === admin._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2"
                      >
                        {rowLoadingId === admin._id ? (
                            "Deleting..."
                        ) : (
                          <>
                            <FaTrash /> Delete
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium shadow transition flex items-center gap-2"
                >
                  {actionLoading ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Edit Admin</h2>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium shadow transition flex items-center gap-2"
                >
                  {actionLoading ? "Updating..." : "Update Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Change Password for {selectedAdmin?.name}
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium shadow transition flex items-center gap-2"
                  >
                    {actionLoading ? (
                      "Updating..."
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmins;
