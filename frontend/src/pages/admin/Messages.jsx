// src/pages/admin/Messages.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../utils/API";
import { FaTrash, FaEnvelopeOpen, FaEye } from "react-icons/fa";
import Loader from "../../component/Loader";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const res = await API.get("/msg/paginated", {
        params: { page, limit: itemsPerPage },
      });

      if (res.data.status) {
        setMessages(res.data.messages);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.post("/msg/deleteMsg", { _id: id }); // You'll need to add delete endpoint
      toast.success("Message deleted");
      fetchMessages(currentPage);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <Loader text="Loading messages..." />
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800 mb-6">
        Manage Enquiries / Messages
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No messages yet
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {msg.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {msg.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Full Message"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="font-medium">{msg.name}</div>
              <div className="text-sm text-gray-600">{msg.email}</div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                {msg.message}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FaEye /> View
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-2"
          >
            <FaChevronLeft /> Prev
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-2"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Message Details</h2>
              <div className="space-y-4">
                <div>
                  <strong>Name:</strong> {selectedMessage.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedMessage.email}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Message:</strong>
                  <p className="mt-2 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
