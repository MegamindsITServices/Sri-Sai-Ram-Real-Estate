const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String,  trim: true, required: true },
    job: { type: String,  trim: true },
    feedback: { type: String,  trim: true, required: true },
    profileImage: { type: String,  trim: true },
    star: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
