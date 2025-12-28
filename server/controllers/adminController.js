const Message = require("../models/Message");
const Listing = require("../models/ProjectModel");
const Testimonials = require("../models/Testimonials");
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const { uploadFile } = require("../utils/cloudinary");

const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalProjects: await Listing.countDocuments(),
      liveProjects: await Listing.countDocuments({ live: true }),
      totalTestimonials: await Testimonials.countDocuments(),
      totalMessages: await Message.countDocuments(),
    };

    // Optional: recent activity
    const recentProjects = await Listing.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt live");

    const recentMessages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    res.json({
      status: true,
      stats,
      recent: {
        projects: recentProjects,
        messages: recentMessages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const [admins] = await Promise.all([
      Admin.find({})
        .select("-password -resetPasswordToken -resetPasswordExpire"),
    ]);

    res.json({
      status: true,
      admins,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, profileLinks = [] } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });


    const newAdmin = new Admin({
      name,
      email,
      password,
      profileLinks,
    });

    if (req.file) {
      newAdmin.avatar = await uploadFile(req.file.buffer, "admin-avatars");
    }

    await newAdmin.save();

    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      admin: { ...newAdmin.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profileLinks } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.name = name;
    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already in use" });
      admin.email = email;
    }
    if (profileLinks) admin.profileLinks = profileLinks;

    if (req.file) {
      admin.avatar = await uploadFile(req.file.buffer, "admin-avatars");
    }

    await admin.save();

    res.json({
      status: true,
      message: "Admin updated",
      admin: { ...admin.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Optional: prevent deleting last admin or self
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "Cannot delete yourself" });
    }

    await Admin.findByIdAndDelete(id);
    res.json({ status: true, message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete admin" });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword;
    await admin.save();

    res.json({ status: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

module.exports = {
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
};
