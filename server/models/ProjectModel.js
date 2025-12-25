const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  creator: {
    type: String,
  },
  thumbnail: {
    type: String,
    required: true,
  },
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
    type: String,
    required: true,
  },
  locationTitle: {
    type: String,
    required: true,
  },
  locationLink: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    enum: ["sqft", "Acre", "Cents"], // Specify allowed units
    required: true,
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
  listingPhotoPaths: [{ type: String }],
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
  floorImage: {
    type: String,
    default: "",
  },
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
    defualt: "notapproved",
  },
  live: {
    type: Boolean,
    default: false,
  },
  totalArea: {
    type: Number,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
