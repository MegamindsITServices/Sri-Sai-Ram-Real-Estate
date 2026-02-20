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

    // Upload Thumbnail - returns {url, public_id}
    const thumbnailData = files?.thumbnail?.[0] ? await uploadFile(files.thumbnail[0].buffer) : undefined;
    const homeThumbnailData = files?.homeThumbnail?.[0]
      ? await uploadFile(files.homeThumbnail[0].buffer)
      : null;


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
      homeThumbnail: homeThumbnailData,
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

    // --- HANDLE THUMBNAIL DELETE ---
    if (deletedImages.includes("THUMBNAIL")) {
      if (existing.thumbnail?.public_id) {
        await deleteFromCloudinary(existing.thumbnail.public_id);
      }
      updateData.thumbnail = null;
    }

    if (deletedImages.includes("HOMETHUMB")) {
      if (existing.homeThumbnail?.public_id) {
        await deleteFromCloudinary(existing.homeThumbnail.public_id);
      }
      updateData.homeThumbnail = null;
    }


    // --- HANDLE FLOOR DELETE ---
    if (deletedImages.includes("FLOOR")) {
      if (existing.floorImage?.public_id) {
        await deleteFromCloudinary(existing.floorImage.public_id);
      }
      updateData.floorImage = null;
    }

    if (deletedImages.length > 0) {
      // Delete from Cloudinary
      const deletePromises = deletedImages.map((id) =>
        deleteFromCloudinary(id),
      );
      await Promise.all(deletePromises);

      // Filter them out of the database array
      currentGallery = currentGallery.filter(
        (img) => !deletedImages.includes(img.public_id),
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

    if (files?.homeThumbnail?.[0]) {
      if (existing.homeThumbnail?.public_id) {
        await deleteFromCloudinary(existing.homeThumbnail.public_id);
      }
      updateData.homeThumbnail = await uploadFile(
        files.homeThumbnail[0].buffer,
      );
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
      { new: true, runValidators: true },
    );

    res.json({
      status: true,
      message: "Project updated successfully",
      project: updatedListing,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};

const getPaginatedProjects = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const { admin, search, status, category, area, sort, minPrice, maxPrice } =
      req.query;

    const filter = {};
    if (admin !== "true") filter.live = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { locationTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;
    if (category) {
      if (category === "commercial_group")
        filter.category = { $in: ["commercial", "commercial_layout"] };
      else if (category === "residential_group")
        filter.category = { $in: ["residential", "residential_layout"] };
      else filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (area) filter.totalArea = { $gte: Number(area) };

    // --- CUSTOM SORT LOGIC START ---
    let pipeline = [{ $match: filter }];

    if (!sort || sort === "none") {
      // Apply weights for custom status sorting
      pipeline.push({
        $addFields: {
          sortWeight: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "upcoming"] }, then: 1 },
                { case: { $eq: ["$status", "newly-launched"] }, then: 2 },
                { case: { $eq: ["$status", "available"] }, then: 3 },
                { case: { $eq: ["$status", "sold-out"] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      });
      pipeline.push({ $sort: { sortWeight: 1, createdAt: -1 } });
    } else {
      // Standard sorting
      let sortQuery = {};
      if (sort === "price-asc") sortQuery = { price: 1 };
      else if (sort === "price-desc") sortQuery = { price: -1 };
      else sortQuery = { createdAt: -1 }; // newest
      pipeline.push({ $sort: sortQuery });
    }
    // --- CUSTOM SORT LOGIC END ---

    // Pagination in pipeline
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const [projects, total] = await Promise.all([
      Listing.aggregate(pipeline),
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
    res.status(500).json({ status: false, message: "Error fetching projects" });
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

const topProjects = async (req, res) => {
  try {
    const projects = await Listing.find({ live: true, topProject: true });

    if (!projects || projects.length == 0) {
      return res.json({ status: false, message: "No Top Projects Found" });
    }
    return res.status(200).json({"status":true, "projects": projects });
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
    const { projectId } = req.body;
    if (!projectId)
      return res
        .status(400)
        .json({ message: "projectId are required." });

    // const existingView = await View.findOne({ userID: userId, projectId });
    // if (existingView)
    //   return res.status(200).json({ message: "Already viewed." });

    // Use findByIdAndUpdate with $inc for atomic operations
    const project = await Listing.findByIdAndUpdate(
      projectId,
      { $inc: { view: 1 } },
      { new: true }
    );

    if (!project)
      return res.status(404).json({ message: "Project not found." });

    // await View.create({ userID: userId, projectId });

    res.status(200).json({ message: "View count updated.", project });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProject = async (req, res) => {
  try {
    const { _id } = req.body;

    const project = await Listing.findById(_id);

    if (!project) {
      return res.json({ status: false, message: "Project Not Found" });
    }

    const formattedProject = {
      ...project.toObject(),
    };

    res.json({ status: true, project: formattedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
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
  topProjects,
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
