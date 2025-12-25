const Listing = require("../models/ProjectModel");
const cloudinary = require("cloudinary");
const View = require("../models/View"); // Path to your Listing model
const Show = require("../models/Showcase");
const { uploadFile } = require("../utils/cloudinary");

const create = async (req, res) => {
  try {
    const formFields = JSON.parse(req.body.formFields || "{}"); // frontend sends formFields as JSON string
    const files = req.files;
    console.log("Form Fields:", formFields);

    // Required validation
    if (
      !formFields.title ||
      !formFields.price ||
      !formFields.totalArea ||
      !formFields.unit
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Handle thumbnail (required)
    if (!files?.thumbnail?.[0]) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }
    const thumbnailUrl = await uploadFile(files.thumbnail[0].buffer);

    // Handle floorImage (optional)
    let floorImageUrl = "";
    if (files?.floorImage?.[0]) {
      floorImageUrl = await uploadFile(files.floorImage[0].buffer);
    }

    // Handle multiple listing photos (required at least 1)
    const listingPhotoUrls = [];
    if (!files?.listingPhotos || files.listingPhotos.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one listing photo is required" });
    }

    for (const photo of files.listingPhotos) {
      const url = await uploadFile(photo.buffer);
      listingPhotoUrls.push(url);
    }

    // Create new document
    const newListing = new Listing({
      ...formFields,
      creator: req.user?._id || "admin", // if you have auth middleware
      thumbnail: thumbnailUrl,
      floorImage: floorImageUrl,
      listingPhotoPaths: listingPhotoUrls,
      price: Number(formFields.price), // better as number
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
    console.error("Create project error:", err);
    res.status(500).json({
      message: "Failed to create project",
      error: err.message,
    });
  }
};

// UPDATE Project
const update = async (req, res) => {
  try {
    const { _id, formFields: formFieldsJson } = req.body;
    const formFields = JSON.parse(formFieldsJson || "{}");
    const files = req.files;

    if (!_id) {
      return res.status(400).json({ message: "_id is required for update" });
    }

    const updateData = { ...formFields };

    // Handle thumbnail (if new file uploaded)
    if (files?.thumbnail?.[0]) {
      updateData.thumbnail = await uploadFile(
        files.thumbnail[0].buffer
      );
    }

    // Handle floorImage (if new file uploaded)
    if (files?.floorImage?.[0]) {
      updateData.floorImage = await uploadFile(
        files.floorImage[0].buffer
      );
    }

    // Handle listing photos (append new ones, keep old ones)
    if (files?.listingPhotos?.length > 0) {
      const newUrls = [];
      for (const photo of files.listingPhotos) {
        const url = await uploadFile(photo.buffer);
        newUrls.push(url);
      }

      // Get existing project to merge photos
      const existing = await Listing.findById(_id);
      if (!existing)
        return res.status(404).json({ message: "Project not found" });

      updateData.listingPhotoPaths = [
        ...(existing.listingPhotoPaths || []),
        ...newUrls,
      ];
    }

    // Convert numbers
    if (formFields.price) updateData.price = Number(formFields.price);
    if (formFields.totalArea)
      updateData.totalArea = Number(formFields.totalArea);
    if (formFields.plotNumber)
      updateData.plotNumber = Number(formFields.plotNumber);
    if (formFields.plot) updateData.plot = Number(formFields.plot);

    const updatedListing = await Listing.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      status: true,
      message: "Project updated successfully",
      project: updatedListing,
    });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({
      message: "Failed to update project",
      error: err.message,
    });
  }
};

const allProjects = async (req, res) => {
  try {
    const courses = await Listing.find({ live: true });

    if (!courses || courses.length == 0) {
      return res.json({ status: false, message: "No Courses Found" });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const adminAllProjects = async (req, res) => {
  try {
    const courses = await Listing.find({});

    if (!courses || courses.length == 0) {
      return res.json({ status: false, message: "No Courses Found" });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    await Listing.deleteOne({ _id });
    res.json({ status: true });
  } catch (err) {
    console.log(err.message);
  }
};

// Controller to handle project views
const incrementProjectView = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    // Check if the userId and projectId are provided
    if (!userId || !projectId) {
      return res
        .status(400)
        .json({ message: "userId and projectId are required." });
    }

    // Check if a view record exists for the given userId and projectId
    const existingView = await View.findOne({ userID: userId, projectId });

    if (existingView) {
      return res
        .status(200)
        .json({ message: "User has already viewed this project." });
    }

    // Increment the project's view count
    const project = await Listing.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.view += 1;
    await project.save();

    // Add a new view record
    const newView = new View({ userID: userId, projectId });
    await newView.save();

    res
      .status(200)
      .json({ message: "View count updated successfully.", project });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the view count." });
  }
};

const getProject = async (req, res) => {
  try {
    const { _id } = req.body;

    const project = await Listing.findById(_id);

    if (project) {
      return res.json({ status: true, project });
    }
    res.json({ statu: false, message: "Project Not Found" });
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
    res
      .status(200)
      .json({
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
  getShowcase,
  adminAllProjects,
};
