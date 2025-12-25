// src/pages/admin/ProjectForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/API";

const ProjectForm = () => {
  const { id } = useParams(); // if id exists → edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    totalArea: "",
    unit: "sqft",
    category: "",
    bhk: "",
    plotNumber: "",
    plot: 1,
    locationTitle: "",
    locationLink: "",
    status: "available",
    balcony: false,
    terrace: false,
    live: false,
    approved: "pending",
  });

  const [thumbnail, setThumbnail] = useState(null); // File or existing URL
  const [floorImage, setFloorImage] = useState(null);
  const [listingPhotos, setListingPhotos] = useState([]); // array of files or URLs
  const [previewImages, setPreviewImages] = useState({
    thumbnail: null,
    floorImage: null,
    listingPhotos: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  // Fetch project data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const res = await API.post("/projects/getProject", { _id: id });
          if (res.data.status) {
            const project = res.data.project;
            setFormData({
              title: project.title || "",
              description: project.description || "",
              price: project.price || "",
              totalArea: project.totalArea || "",
              unit: project.unit || "sqft",
              category: project.category || "",
              bhk: project.bhk || "",
              plotNumber: project.plotNumber || "",
              plot: project.plot || 1,
              locationTitle: project.locationTitle || "",
              locationLink: project.locationLink || "",
              status: project.status || "available",
              balcony: project.balcony || false,
              terrace: project.terrace || false,
              live: project.live || false,
              approved: project.approved || "pending",
            });

            // Set previews for existing images
            setPreviewImages({
              thumbnail: project.thumbnail,
              floorImage: project.floorImage || null,
              listingPhotos: project.listingPhotoPaths || [],
            });
          }
        } catch (err) {
          toast.error("Failed to load project data");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchProject();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === "thumbnail") {
      setThumbnail(file);
      setPreviewImages((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }));
    } else if (field === "floorImage") {
      setFloorImage(file);
      setPreviewImages((prev) => ({
        ...prev,
        floorImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleMultiplePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setListingPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => ({
      ...prev,
      listingPhotos: [...prev.listingPhotos, ...newPreviews],
    }));
  };

  const removeListingPhoto = (index) => {
    setListingPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => ({
      ...prev,
      listingPhotos: prev.listingPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      // 1. Wrap text data into a "formFields" object as the backend expects
      // We stringify it because FormData only sends strings or Blobs/Files
      payload.append("formFields", JSON.stringify(formData));

      // 2. Append individual files
      if (thumbnail && thumbnail instanceof File) {
        payload.append("thumbnail", thumbnail);
      } else if (isEditMode && typeof thumbnail === "string") {
        // If editing and no new file, we pass the existing URL inside formFields
        // (Handled by JSON.stringify(formData) above if you add it to state)
      }

      if (floorImage && floorImage instanceof File) {
        payload.append("floorImage", floorImage);
      }

      // 3. Append Multiple Photos
      listingPhotos.forEach((photo) => {
        if (photo instanceof File) {
          payload.append("listingPhotos", photo);
        }
      });

      // 4. Send ID separately if editing
      if (isEditMode) {
        payload.append("_id", id);
      }

      const endpoint = isEditMode ? "/projects/update" : "/projects/create";

      const res = await API.post(endpoint, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(isEditMode ? "Project updated!" : "Project created!");
        navigate("/admin/projects");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5BE86]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold fira-sans text-gray-800 mb-6">
        {isEditMode ? "Edit Project" : "Add New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Category</option>
                <option value="residential">Residential Plots</option>
                <option value="commercial">Commercial Plots</option>
                <option value="house">House/Villa</option>
                <option value="agricultural">Agricultural Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area *
                </label>
                <input
                  type="number"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="sqft">Sq.ft</option>
                  <option value="Acre">Acre</option>
                  <option value="Cents">Cents</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Title *
              </label>
              <input
                type="text"
                name="locationTitle"
                value={formData.locationTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                name="locationLink"
                value={formData.locationLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="balcony"
                checked={formData.balcony}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#F5BE86] focus:ring-[#F5BE86]"
              />
              Balcony
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="terrace"
                checked={formData.terrace}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#F5BE86] focus:ring-[#F5BE86]"
              />
              Terrace
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Images</h2>

          {/* Thumbnail */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "thumbnail")}
              className="hidden"
              id="thumbnail"
              required={!isEditMode}
            />
            <label
              htmlFor="thumbnail"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded inline-block"
            >
              Choose Thumbnail
            </label>
            {previewImages.thumbnail && (
              <div className="mt-3">
                <img
                  src={previewImages.thumbnail}
                  alt="Thumbnail preview"
                  className="h-32 w-48 object-cover rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Floor Plan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floor Plan
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "floorImage")}
              className="hidden"
              id="floorImage"
            />
            <label
              htmlFor="floorImage"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded inline-block"
            >
              Upload Floor Plan
            </label>
            {previewImages.floorImage && (
              <div className="mt-3">
                <img
                  src={previewImages.floorImage}
                  alt="Floor plan preview"
                  className="h-48 w-full object-contain rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Multiple Listing Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiplePhotos}
              className="hidden"
              id="listingPhotos"
            />
            <label
              htmlFor="listingPhotos"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded inline-block"
            >
              Add Photos
            </label>

            {previewImages.listingPhotos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewImages.listingPhotos.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeListingPhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
          />
        </div>

        {/* Status & Visibility */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Status & Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="available">Available</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="live"
                checked={formData.live}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#F5BE86]"
              />
              <span>Live / Published</span>
            </label>

            <div className="text-sm text-gray-600">
              Approved: {formData.approved === "approved" ? "Yes" : "Pending"}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F5BE86] hover:bg-[#e0a76f] text-white px-8 py-2.5 rounded-lg font-medium shadow-md transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
