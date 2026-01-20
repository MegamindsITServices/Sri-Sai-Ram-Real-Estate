import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import API from "../../utils/API";

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    totalArea: "",
    unit: "sqft",
    category: "",
    bhk: "", // Added as per schema
    plotNumber: "",
    locationTitle: "",
    locationLink: "",
    status: "available",
    balcony: false,
    terrace: false,
    live: false,
    startingPlotSize : "",
    startingPlotUnit: "sqft",
    topProject : false,
    approvalType: [],
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [floorImage, setFloorImage] = useState(null);
  const [listingPhotos, setListingPhotos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState({
    thumbnail: null,
    floorImage: null,
    listingPhotos: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const isLayout = formData.category === "commercial_layout" || formData.category === "residential_layout";
  const isPlot = formData.category === "residential" || formData.category === "commercial";

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
              locationTitle: project.locationTitle || "",
              locationLink: project.locationLink || "",
              status: project.status || "available",
              balcony: project.balcony || false,
              terrace: project.terrace || false,
              live: project.live || false,
              startingPlotSize: project.startingPlotSize || "",
              startingPlotUnit: project.startingPlotUnit || "sqft",
              topProject: project.topProject || false,
              approvalType: project.approvalType || [],
            });

            setListingPhotos(project.listingPhotoPaths || []);

            setPreviewImages({
              thumbnail: project.thumbnail?.url || project.thumbnail,
              floorImage: project.floorImage?.url || project.floorImage || null,
              listingPhotos:
                project.listingPhotoPaths?.map((img) => img.url) || [],
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
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };

      // If user switches TO layout, clear residential-only fields manually
      if (name === "category" && (val === "residential_layout" || val === "commercial_layout")) {
        updated.bhk = "";
        updated.balcony = false;
        updated.terrace = false;
        updated.startingPlotUnit = "sqft"; 
      }
      return updated;
    });
  };

  const handleApprovalChange = (value) => {
    setFormData((prev) => {
      const exists = prev.approvalType.includes(value);

      return {
        ...prev,
        approvalType: exists
          ? prev.approvalType.filter((v) => v !== value) // remove
          : [...prev.approvalType, value], // add
      };
    });
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

  const removeThumbnail = () => {
    if (
      previewImages.thumbnail &&
      typeof previewImages.thumbnail === "string"
    ) {
      setDeletedImages((prev) => [...prev, "THUMBNAIL"]);
    }
    setThumbnail(null);
    setPreviewImages((prev) => ({ ...prev, thumbnail: null }));
  };

  const removeFloorImage = () => {
    if (
      previewImages.floorImage &&
      typeof previewImages.floorImage === "string"
    ) {
      setDeletedImages((prev) => [...prev, "FLOOR"]);
    }
    setFloorImage(null);
    setPreviewImages((prev) => ({ ...prev, floorImage: null }));
  };



  const handleMultiplePhotos = (e) => {
    const files = Array.from(e.target.files);
    setListingPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => ({
      ...prev,
      listingPhotos: [...prev.listingPhotos, ...newPreviews],
    }));
  };

  const removeListingPhoto = (index) => {
    const photoToRemove = listingPhotos[index];
    if (photoToRemove?.public_id) {
      setDeletedImages((prev) => [...prev, photoToRemove.public_id]);
    }
    setListingPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => ({
      ...prev,
      listingPhotos: prev.listingPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(previewImages)
    if (!previewImages.thumbnail) {
      toast.error("Thumbnail is required");
      setLoading(false);
      return;
    }
    try {

      const payload = new FormData();
      payload.append("formFields", JSON.stringify(formData));

      payload.append("deletedImages", JSON.stringify(deletedImages));

      if (thumbnail instanceof File) payload.append("thumbnail", thumbnail);
      if (floorImage instanceof File) payload.append("floorImage", floorImage);

      listingPhotos.forEach((photo) => {
        if (photo instanceof File) payload.append("listingPhotos", photo);
      });

      if (isEditMode) payload.append("_id", id);

      const endpoint = isEditMode ? "/projects/update" : "/projects/create";
      const res = await API.post(endpoint, payload);

      if (res.data.status) {
        toast.success(isEditMode ? "Project updated!" : "Project created!");
        navigate("/admin/projects");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#F5BE86] mb-4" />
        <p className="text-gray-500 font-medium">Fetching Project Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Project" : "Add New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ownership & Identity */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#F5BE86]">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Identification
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Skyline Apartments"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              />
            </div>
          </div>
        </div>

        {/* Property Specs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Specifications & Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
              >
                <option value="">Select Type</option>
                <option value="residential">Residential Plots</option>
                <option value="commercial">Commercial Plots</option>
                <option value="apartment">Apartment</option>
                <option value="villa">House/Villa</option>
                <option value="commercial_layout">Commercial Layout</option>
                <option value="residential_layout">Residential Layout</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isLayout ? "Starting Price" : "Price"} (₹){" "}
                <span className="text-red-500">*</span>
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
            {["villa", "apartment"].includes(formData.category) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BHK Type
                </label>
                <input
                  type="number"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleInputChange}
                  placeholder="e.g. 2, 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {isLayout && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Plot Size
                </label>

                <div className="flex gap-2">
                  <input
                    type="number"
                    name="startingPlotSize"
                    value={formData.startingPlotSize}
                    onChange={handleInputChange}
                    placeholder="e.g. 600"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />

                  <select
                    name="startingPlotUnit"
                    value={formData.startingPlotUnit}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="sqft">Sq.ft</option>
                    <option value="Acre">Acre</option>
                    <option value="Cents">Cents</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {isLayout && (
            <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area
                </label>
                <input
                  type="number"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  placeholder="e.g. 1200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
                >
                  <option value="sqft">Sq.ft</option>
                  <option value="Acre">Acre</option>
                  <option value="Cents">Cents</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Plots
                </label>
                <input
                  type="number"
                  name="plotNumber"
                  value={formData.plotNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 85"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Common Area fields for non-layout */}
          {!isLayout && (
            <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area <span className="text-red-500">*</span>
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
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="sqft">Sq.ft</option>
                  <option value="Acre">Acre</option>
                  <option value="Cents">Cents</option>
                </select>
              </div>
              {!["villa", "apartment"].includes(formData.category) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isPlot ? "Plot Number" : "Number of Plots"}
                  </label>
                  <input
                    type="number"
                    name="plotNumber"
                    value={formData.plotNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 85"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationTitle"
                value={formData.locationTitle}
                onChange={handleInputChange}
                required
                placeholder="e.g. Jubilee Hills, Hyderabad"
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
                placeholder="https://goo.gl/maps/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Visuals Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Property Visuals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="hidden"
                  id="thumbnail"
                  required={!previewImages.thumbnail}
                />

                <label
                  htmlFor="thumbnail"
                  className="cursor-pointer text-[#2B2BD9] hover:underline"
                >
                  Click to upload main image
                </label>
                {previewImages.thumbnail && (
                  <div className="relative mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                    <img
                      src={previewImages.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-40 object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floor Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isLayout ? "Master Plan" : "Floor Plan"}
              </label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "floorImage")}
                  className="hidden"
                  id="floorImage"
                />
                <label
                  htmlFor="floorImage"
                  className="cursor-pointer text-[#2B2BD9] hover:underline"
                >
                  Click to upload floor plan
                </label>
                {previewImages.floorImage && (
                  <div className="relative mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                    <img
                      src={previewImages.floorImage}
                      alt="Floor"
                      className="w-full h-40 object-contain bg-white"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeFloorImage}
                        className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Multiple Photos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Gallery Images
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="file"
                multiple
                onChange={handleMultiplePhotos}
                className="hidden"
                id="listingPhotos"
              />
              <label
                htmlFor="listingPhotos"
                className="cursor-pointer bg-[#2B2BD9] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaPlus /> Add Photos
              </label>
              <p className="text-xs text-gray-400 font-semibold uppercase">
                Existing and new photos will appear below
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {previewImages.listingPhotos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100"
                >
                  <img
                    src={src}
                    alt="Gallery"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeListingPhoto(idx)}
                      className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features & Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Details & Features
          </h2>
          {["villa", "apartment"].includes(formData.category) && (
            <div className="flex gap-8 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded text-[#2B2BD9]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Has Balcony
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="terrace"
                  checked={formData.terrace}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded text-[#2B2BD9]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Has Terrace
                </span>
              </label>
            </div>
          )}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Write a detailed description about the property..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5BE86]"
          />
        </div>

        {/* Admin Controls */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-10 items-center">
            <div className="flex items-center gap-2 border border-gray-300 rounded p-1">
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Approval Type:
                </label>

                <div className="flex flex-wrap gap-5">
                  {["CMDA", "DTCP", "Panchayat"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.approvalType.includes(type)}
                        onChange={() => handleApprovalChange(type)}
                        className="h-5 w-5 accent-[#2B2BD9]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border rounded border-gray-300 px-2 py-1"
              >
                <option value="available">Available</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="live"
                checked={formData.live}
                onChange={handleInputChange}
                className="h-5 w-5"
              />
              <span className="text-sm font-bold text-gray-700">Publish</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="topProject"
                checked={formData.topProject}
                onChange={handleInputChange}
                className="h-5 w-5"
              />
              <span className="text-sm font-bold text-gray-700">
                Add to Top Projects
              </span>
            </label>
            <div className="text-sm font-medium">
              {/* Approval Status:{" "}
              <span
                className={
                  formData.approved === "approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {formData.approved === "approved" ? "Approved" : "Pending"}
              </span> */}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2B2BD9] hover:bg-blue-800 text-white px-10 py-2 rounded-md font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Listing"
                : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
