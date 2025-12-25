// src/pages/admin/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { updateName, updateAvatar, setLogin } from "../../redux/UserSlice";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatarFile: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState(user?.avatar || "/images/avatar.png");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Always load fresh user data on mount
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/current-user");
        if (res.data.success) {
          dispatch(setLogin({ user: res.data.user }));
          setFormData((prev) => ({ ...prev, name: res.data.user.name }));
          setPreview(res.data.user.avatar);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      if (formData.avatarFile) {
        payload.append("avatar", formData.avatarFile); // your backend expects "image"
      }
      console.log(payload);

      const res = await API.post("/admin-auth/update-profile", payload);

      if (res.data.success) {
        // Refresh full user data (gets latest avatar URL from server)
        const freshRes = await API.get("/auth/current-user");
        if (freshRes.data.success) {
          dispatch(setLogin({ user: freshRes.data.user }));
          setPreview(freshRes.data.user.avatar);
        }

        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (formData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const res = await API.put("/admin-auth/update-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (res.data.success) {
        toast.success("Password updated successfully!");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Update */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Update Profile</h2>

          <div className="flex flex-col items-center mb-6">
            <img
              src={preview}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#F5BE86] mb-4"
            />
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full hover:bg-[#F5BE86] bg-[#e0a76f] text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B2BD9] hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
