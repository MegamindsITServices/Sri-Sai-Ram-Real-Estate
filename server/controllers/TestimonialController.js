const Testimonial = require("../models/Testimonials");
const { uploadFile } = require("../utils/cloudinary");

// ADD
const add = async (req, res) => {
  try {
    const { name, job, feedback, star } = req.body;
    const file = req.file;

    if (!name || !feedback) {
      return res
        .status(400)
        .json({ message: "Name and feedback are required" });
    }

    let imageUrl = null;

    if (file) {
      imageUrl = await uploadFile(file.buffer, "srisai-testimonials");
    }

    const newTestimonial = new Testimonial({
      name,
      job: job || "", // optional
      feedback,
      profileImage: imageUrl, // optional
      star: Number(star) || 5,
    });

    await newTestimonial.save();

    res.json({
      status: true,
      message: "Testimonial added",
      testimonial: newTestimonial,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add testimonial", error: err.message });
  }
};


// GET ALL
const allTestimonial = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json({ status: true, testimonials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getPaginatedTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 9; // items per page
    const skip = (page - 1) * limit;

    const total = await Testimonial.countDocuments(); // total count
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      status: true,
      testimonials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteTestimonial = async (req, res) => {
  try {
    const { _id } = req.body;
    await Testimonial.findByIdAndDelete(_id);
    res.json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EDIT
const edit = async (req, res) => {
  try {
    const { _id, name, job, feedback, star } = req.body;
    const file = req.file;

    const updateData = { name, job, feedback, star: Number(star) };

    if (file) {
      updateData.profileImage = await uploadFile(file.buffer, "srisai-testimonials");
    }

    const updated = await Testimonial.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json({
      status: true,
      message: "Updated successfully",
      testimonial: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { add, allTestimonial, deleteTestimonial, getPaginatedTestimonials, edit };
