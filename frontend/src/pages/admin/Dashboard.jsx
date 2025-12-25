// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { FaBuilding, FaStar, FaEnvelope, FaUsers } from "react-icons/fa";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import Loader from "../../component/Loader";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [stats, setStats] = useState({
    totalProjects: 0,
    liveProjects: 0,
    totalTestimonials: 0,
    totalMessages: 0,
  });

  const [recent, setRecent] = useState({
    projects: [],
    messages: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/dashboard-stats");

      if (res.data.status) {
        setStats(res.data.stats);
        setRecent(res.data.recent);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800">
            Welcome {user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage SRI SAI RAM Real Estate & Construction
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaBuilding className="text-3xl text-[#2B2BD9]" />}
          title="Total Projects"
          value={stats.totalProjects}
          subValue={`${stats.liveProjects} Live`}
          color="blue"
        />

        <StatCard
          icon={<FaStar className="text-3xl text-[#F5BE86]" />}
          title="Testimonials"
          value={stats.totalTestimonials}
          color="gold"
        />

        <StatCard
          icon={<FaEnvelope className="text-3xl text-green-600" />}
          title="Enquiries"
          value={stats.totalMessages}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <ActionButton
            label="Add Project"
            onClick={() => navigate("/admin/projects/new")}
            color="bg-[#374151] hover:bg-[#4b5563]"
          />
          <ActionButton
            label="Manage Testimonials"
            onClick={() => navigate("/admin/testimonials")}
            color="bg-[#1E3A8A] hover:bg-[#172f6b]"
          />
          <ActionButton
            label="View Messages"
            onClick={() => navigate("/admin/messages")}
            color="bg-green-600 hover:bg-green-700"
          />
          <ActionButton
            label="Update Profile"
            onClick={() => navigate("/admin/profile")}
            color="bg-purple-600 hover:bg-purple-700"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
          <div className="border-b pb-4 border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-xl text-[#1e1e2f]">
              Recent Listings
            </h3>
            <button
              onClick={() => navigate("/admin/projects")}
              className="text-xs font-bold underline text-[#2B2BD9]"
            >
              View All
            </button>
          </div>
          {recent.projects.length === 0 ? (
            <p className="text-gray-500">No recent projects</p>
          ) : (
            <div className="space-y-4">
              {recent.projects.map((proj) => (
                <div
                  key={proj._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{proj.title}</p>
                    <p className="text-sm text-gray-500">
                      {proj.createdAt &&
                        format(new Date(proj.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      proj.live
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}
                  >
                    {proj.live ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
          <div className="pb-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-xl text-[#1e1e2f]">
              Recent Enquiries
            </h3>
            <button
              onClick={() => navigate("/admin/messages")}
              className="text-xs font-bold underline text-[#2B2BD9]"
            >
              View All
            </button>
          </div>
          {recent.messages.length === 0 ? (
            <p className="text-gray-500">No recent messages</p>
          ) : (
            <div className="space-y-4">
              {recent.messages.map((msg) => (
                <div key={msg._id} className="border-b pb-3">
                  <p className="font-medium">{msg.name}</p>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ icon, title, value, subValue, color }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-md border-l-4"
    style={{
      borderColor:
        color === "gold" ? "#F5BE86" : color === "blue" ? "#2B2BD9" : "#10B981",
    }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-md text-gray-700">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
);

// Reusable Action Button
const ActionButton = ({ label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${color} text-white px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition text-center`}
  >
    {label}
  </button>
);

export default AdminDashboard;
