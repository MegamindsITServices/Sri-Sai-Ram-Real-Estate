const Message = require("../models/Message");
const Listing = require("../models/ProjectModel");
const Testimonials = require("../models/Testimonials");


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

module.exports = { getDashboardStats };
