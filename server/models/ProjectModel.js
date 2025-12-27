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
    creator: {
      type: String,
    },
    thumbnail: imageSchema,
    title: {
      type: String,
      required: true,
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
    //   sqft: {
    //     type: Number,
    //   },
    //   width: {
    //     type: Number,
    //   },
    //   length: {
    //     type: Number,
    //   },
    //   Acre: {
    //     type: Number,
    // },
    status: {
      type: String,
      enum: ["available", "sold-out"],
      default: "available",
    },
    // year: {
    //     type: Number
    // },
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
    //     Cents:{
    //         type:Number,
    //     },
    // landType:{
    //     type:String,
    //     default:'dry'
    // },
    plot: {
      type: Number,
      default: 1,
    },
    approved: {
      type: String,
      default: "notapproved",
    },
    live: {
      type: Boolean,
      default: false,
    },
    totalArea: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
