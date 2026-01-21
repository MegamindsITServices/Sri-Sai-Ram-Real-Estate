const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String },
    public_id: { type: String },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    thumbnail: imageSchema,
    homeThumbnail: imageSchema,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bhk: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    locationTitle: {
      type: String,
      required: true,
    },
    locationLink: {
      type: String,
    },
    unit: {
      type: String,
      enum: ["sqft", "Acre", "Cents"], // Specify allowed units
    },
    status: {
      type: String,
      enum: ["available", "sold-out"],
      default: "available",
    },
    listingPhotoPaths: [imageSchema],
    view: {
      type: Number,
      default: 0,
    },
    balcony: {
      type: Boolean,
      default: false,
    },
    terrace: {
      type: Boolean,
      default: false,
    },
    floorImage: imageSchema,
    category: {
      type: String,
    },
    plotNumber: {
      type: Number,
    },
    approvalType: {
      type: [String],
      enum: ["CMDA", "DTCP", "Panchayat"],
      default: [],
    },
    live: {
      type: Boolean,
      default: false,
    },
    topProject: {
      type: Boolean,
      default: false,
    },
    totalArea: {
      type: Number,
    },
    startingPlotSize: {
      type: Number,
    },
    startingPlotUnit: {
      type: String,
      enum: ["sqft", "Acre", "Cents"],
      default: "sqft",
    },
  },
  { timestamps: true },
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
