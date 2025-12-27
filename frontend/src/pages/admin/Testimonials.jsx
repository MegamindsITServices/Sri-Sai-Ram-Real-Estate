// src/pages/admin/Testimonials.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../utils/API";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Loader from "../../component/Loader";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [submitLoading, setSubmitLoading] = useState(false); 
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // delete per card

  const [form, setForm] = useState({
    name: "",
    job: "",
    feedback: "",
    star: 5,
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  const fetchTestimonials = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.get("/testimonial/paginated", {
        params: { page, limit: 9 },
      });
      if (res.data.status) {
        setTestimonials(res.data.testimonials);
        setPaginationInfo(res.data.pagination);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditMode(true);
      setCurrentTestimonial(testimonial);
      setForm({
        name: testimonial.name,
        job: testimonial.job,
        feedback: testimonial.feedback,
        star: testimonial.star,
        profileImage: null,
      });
      setPreview(testimonial.profileImage);
    } else {
      setEditMode(false);
      setCurrentTestimonial(null);
      setForm({ name: "", job: "", feedback: "", star: 5, profileImage: null });
      setPreview(null);
    }
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("job", form.job);
    payload.append("feedback", form.feedback);
    payload.append("star", form.star);
    if (form.profileImage) payload.append("profileImage", form.profileImage);
    if (editMode) payload.append("_id", currentTestimonial._id);

    try {
       const endpoint = editMode ? "/testimonial/edit" : "/testimonial/add";
      await toast.promise(API.post(endpoint, payload), {
        loading: editMode ? "Updating testimonial..." : "Adding testimonial...",
        success: editMode
          ? "Testimonial updated successfully!"
          : "Testimonial added successfully!",
        error: (err) => err.response?.data?.message || "Operation failed",
      });

      setModalOpen(false);
      fetchTestimonials(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    setDeleteLoadingId(id);

    try {
      await toast.promise(
        API.post("/testimonial/deleteTestimonial", { _id: id }),
        {
          loading: "Deleting testimonial...",
          success: "Testimonial deleted successfully!",
          error: "Delete failed",
        }
      );

      fetchTestimonials(currentPage);
    } finally {
      setDeleteLoadingId(null);
    }
  };


  if (loading) return <Loader />;

  return (
    <div className="py-4 md:py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800">
          Manage Testimonials
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#FFC13B] hover:bg-[#e0a76f] text-white px-5 py-2.5 rounded-lg shadow"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Grid / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            No testimonials yet
          </p>
        ) : (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="p-4 flex items-center gap-4 border-b">
                <img
                  src={t.profileImage}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-600">{t.job}</p>
                  <div className="flex text-[#F5BE86]">
                    {[...Array(t.star)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    {[...Array(5 - t.star)].map((_, i) => (
                      <FaStar key={i} className="text-gray-300" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="p-4 text-gray-700 flex-1 italic">"{t.feedback}"</p>

              <div className="p-3 border-t flex justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium 
               text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700
               transition"
                >
                  <FaEdit className="text-base" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium 
               text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700
               transition"
                >
                  {deleteLoadingId === t._id ? (
                    <Loader size="sm" text={null} />
                  ) : (
                    <FaTrash />
                  )}
                  {deleteLoadingId === t._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editMode ? "Edit Testimonial" : "Add Testimonial"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job/Profession <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.job}
                    onChange={(e) => setForm({ ...form, job: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Feedback <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={form.feedback}
                    onChange={(e) =>
                      setForm({ ...form, feedback: e.target.value })
                    }
                    rows={4}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating (1-5) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.star}
                    onChange={(e) =>
                      setForm({ ...form, star: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Profile Image <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer border border-gray-300 bg-gray-200 hover:bg-gray-200 px-4 py-2 rounded inline-block"
                  >
                    Choose Image
                  </label>
                  {preview && (
                    <div className="mt-3">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded shadow"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => !submitLoading && setModalOpen(false)}
                    disabled={submitLoading}
                    className={`px-6 py-2 border rounded-lg hover:bg-gray-50 ${submitLoading ? "cursor-not-allowed" : ""}`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white
                        ${
                          submitLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#FFC13B] hover:bg-yellow-400"
                        }`}
                  >
                    {submitLoading
                      ? editMode
                        ? "Updating..."
                        : "Adding..."
                      : editMode
                      ? "Update"
                      : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
