const Listing = require("../models/ProjectModel");
const cloudinary = require("cloudinary");
const View = require("../models/View"); // Path to your Listing model
const Show = require("../models/Showcase");
const { uploadFile, deleteFromCloudinary } = require("../utils/cloudinary");

const create = async (req, res) => {
  try {
    const formFields = JSON.parse(req.body.formFields || "{}");
    const files = req.files;

    if (!formFields.title || !formFields.price || !formFields.totalArea) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!files?.thumbnail?.[0]) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    // Upload Thumbnail - returns {url, public_id}
    const thumbnailData = await uploadFile(files.thumbnail[0].buffer);

    // Handle floorImage (optional)
    let floorImageData = null;
    if (files?.floorImage?.[0]) {
      floorImageData = await uploadFile(files.floorImage[0].buffer);
    }

    // Handle gallery photos
    const listingPhotosData = [];
    if (files?.listingPhotos) {
      for (const photo of files.listingPhotos) {
        const uploaded = await uploadFile(photo.buffer);
        listingPhotosData.push(uploaded);
      }
    }

    const newListing = new Listing({
      ...formFields,
      thumbnail: thumbnailData,
      floorImage: floorImageData,
      listingPhotoPaths: listingPhotosData,
      price: Number(formFields.price),
      totalArea: Number(formFields.totalArea),
      plotNumber: Number(formFields.plotNumber) || undefined,
      plot: Number(formFields.plot) || 1,
    });

    await newListing.save();

    res.status(201).json({
      status: true,
      message: "Project created successfully",
      project: newListing,
    });
  } catch (err) {
    console.error("Create error:", err);
    res
      .status(500)
      .json({ message: "Failed to create project", error: err.message });
  }
};
// UPDATE Project
const update = async (req, res) => {
  try {
    const {
      _id,
      formFields: formFieldsJson,
      deletedImages: deletedImagesJson,
    } = req.body;
    const formFields = JSON.parse(formFieldsJson || "{}");

    // This expects an array of public_ids to delete: ["id1", "id2"]
    const deletedImages = JSON.parse(deletedImagesJson || "[]");
    const files = req.files;

    if (!_id) return res.status(400).json({ message: "_id is required" });

    const existing = await Listing.findById(_id);
    if (!existing)
      return res.status(404).json({ message: "Project not found" });

    const updateData = { ...formFields };

    // --- 1. HANDLE DELETION OF SPECIFIC GALLERY IMAGES ---
    let currentGallery = existing.listingPhotoPaths || [];

    if (deletedImages.length > 0) {
      // Delete from Cloudinary
      const deletePromises = deletedImages.map((id) =>
        deleteFromCloudinary(id)
      );
      await Promise.all(deletePromises);

      // Filter them out of the database array
      currentGallery = currentGallery.filter(
        (img) => !deletedImages.includes(img.public_id)
      );
    }

    // --- 2. HANDLE THUMBNAIL UPDATE ---
    if (files?.thumbnail?.[0]) {
      if (existing.thumbnail?.public_id) {
        await deleteFromCloudinary(existing.thumbnail.public_id);
      }
      updateData.thumbnail = await uploadFile(files.thumbnail[0].buffer);
    }

    // --- 3. HANDLE FLOOR IMAGE UPDATE ---
    if (files?.floorImage?.[0]) {
      if (existing.floorImage?.public_id) {
        await deleteFromCloudinary(existing.floorImage.public_id);
      }
      updateData.floorImage = await uploadFile(files.floorImage[0].buffer);
    }

    // --- 4. HANDLE NEW GALLERY UPLOADS ---
    const newPhotos = [];
    if (files?.listingPhotos?.length > 0) {
      for (const photo of files.listingPhotos) {
        const uploaded = await uploadFile(photo.buffer);
        newPhotos.push(uploaded);
      }
    }

    // Final merge: (Old photos - deleted photos) + New photos
    updateData.listingPhotoPaths = [...currentGallery, ...newPhotos];

    // Data Sanitization
    if (formFields.price) updateData.price = Number(formFields.price);
    if (formFields.totalArea)
      updateData.totalArea = Number(formFields.totalArea);

    const updatedListing = await Listing.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      status: true,
      message: "Project updated successfully",
      project: updatedListing,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

const getPaginatedProjects = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Filters
    const {
      admin,
      search,
      status,
      category,
      area,
      sort = "newest",
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    // 🔐 Public vs Admin
    if (admin !== "true") {
      filter.live = true;
    }

    // 🔍 Search (text-like search)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { locationTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷 Status filter
    if (status) {
      filter.status = status; // available | sold-out
    }

    // 🏠 Category filter
    if (category) {
      filter.category = category;
    }

    // 💰 Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (area) {
      filter.totalArea = { $gte: Number(area) };
    }

    let sortQuery = { createdAt: -1 };

    switch (sort) {
      case "price-asc":
        sortQuery = { price: 1 };
        break;

      case "price-desc":
        sortQuery = { price: -1 };
        break;

      case "newest":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    // Fetch data
    const [projects, total] = await Promise.all([
      Listing.find(filter).sort(sortQuery).skip(skip).limit(limit),
      Listing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      status: true,
      projects,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Pagination Error:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching paginated projects",
    });
  }
};

const getAlsoLikeProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    // Build query: exclude current project and must be live
    let query = { _id: { $ne: id }, live: true };

    // Optional: Filter by same category for better "similarity"
    if (category) {
      query.category = category;
    }

    const projects = await Listing.find(query).limit(8).sort({ createdAt: -1 }); // Show newest first

    res.json({
      status: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const allProjects = async (req, res) => {
  try {
    const projects = await Listing.find({ live: true });

    if (!projects || projects.length == 0) {
      return res.json({ status: false, message: "No Projects Found" });
    }
    return res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const adminAllProjects = async (req, res) => {
  try {
    const projects = await Listing.find({});

    if (!projects || projects.length == 0) {
      return res.json({ status: false, message: "No Projects Found" });
    }
    return res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ message: "_id required" });

    const project = await Listing.findById(_id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🔥 1. Delete Thumbnail
    if (project.thumbnail?.public_id) {
      await deleteFromCloudinary(project.thumbnail.public_id);
    }

    // 🔥 2. Delete Floor Image
    if (project.floorImage?.public_id) {
      await deleteFromCloudinary(project.floorImage.public_id);
    }

    // 🔥 3. Delete All Gallery Photos
    if (project.listingPhotoPaths?.length > 0) {
      const deletePromises = project.listingPhotoPaths.map((img) =>
        deleteFromCloudinary(img.public_id)
      );
      await Promise.all(deletePromises);
    }

    // 4. Delete DB Record
    await Listing.findByIdAndDelete(_id);

    res.json({
      status: true,
      message: "Project and all assets deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete operation failed" });
  }
};
// Controller to handle project views
const incrementProjectView = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    if (!userId || !projectId)
      return res
        .status(400)
        .json({ message: "userId and projectId are required." });

    const existingView = await View.findOne({ userID: userId, projectId });
    if (existingView)
      return res.status(200).json({ message: "Already viewed." });

    // Use findByIdAndUpdate with $inc for atomic operations
    const project = await Listing.findByIdAndUpdate(
      projectId,
      { $inc: { view: 1 } },
      { new: true }
    );

    if (!project)
      return res.status(404).json({ message: "Project not found." });

    await View.create({ userID: userId, projectId });

    res.status(200).json({ message: "View count updated.", project });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const getProject = async (req, res) => {
  try {
    const { _id } = req.body;

    const project = await Listing.findById(_id);

    if (project) {
      return res.json({ status: true, project });
    }
    res.json({ status: false, message: "Project Not Found" });
  } catch (err) {
    console.log(err.message);
  }
};

const showcase = async (req, res) => {
  const { show } = req.body;

  try {
    // Update or create the selection in the database
    const updatedShowcase = await Show.findOneAndUpdate(
      {}, // Assuming a single document is managed
      { show },
      { new: true, upsert: true } // Create if not exists
    );
    res.status(200).json({
      message: "Showcase updated successfully",
      data: updatedShowcase,
    });
  } catch (error) {
    console.error("Error updating showcase:", error);
    res.status(500).json({ error: "Failed to update showcase" });
  }
};

const getShowcase = async (req, res) => {
  try {
    const showcase = await Show.findOne({});

    res.json({ status: true, showcase });
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = {
  create,
  allProjects,
  update,
  deleteProject,
  incrementProjectView,
  getProject,
  showcase,
  getPaginatedProjects,
  getShowcase,
  getAlsoLikeProjects,
  adminAllProjects,
};
