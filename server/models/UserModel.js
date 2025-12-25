const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  password: { type: String, required: true },
  coins: { type: Number, default: 0 },
  avatar: {
    type: String,
    default: "/images/avatar.png",
  },
  // achievements: [
  //   {
  //     courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  //     rank: { type: String },
  //     score: { type: Number },
  //     certification: { type: Boolean, default: false }
  //   }
  // ],

  profileLinks: {
    resume: { type: String },
  },
  seenNotification:{
    type:Boolean,
    default:false
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token

userSchema.methods.generateToken = function (payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
