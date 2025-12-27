const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/AdminModel.js");
const ejs = require("ejs");
const path = require("path");
const { sendEmail } = require("../utils/sendMail.js");
const crypto = require("crypto");
const { uploadFile } = require("../utils/cloudinary.js");

const createActivationToken = (user) => {
  const token = jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.ACTIVATION_EXPIRE,
  });
  return token;
};

const sendVerficationEmail = async (user) => {
  const activationToken = createActivationToken(user);
  const activationUrl = `${process.env.SERVER_URL}/api/v1/auth/verify-email?token=${activationToken}`;
  const data = { user: { name: user.name }, activationUrl };
  const html = await ejs.renderFile(
    path.join(__dirname, "../emails/activation-email.ejs"),
    data
  );
  await sendEmail({
    to: user.email,
    subject: "Activate Your Acount",
    html,
  });
};

const register = async (req, res) => {
  try {
    const existingUser = await AdminModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await AdminModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = admin.toObject();
    userData.role = "admin";

    const token = admin.generateToken(userData);

    res.json({
      success: true,
      token,
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await AdminModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
   
    user.password=newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to updated password" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.user._id);
    console.log(req.body);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update name
    if (req.body.name) {
      admin.name = req.body.name;
    }

    // Update avatar
    if (req.file) {
      const avatarUrl = await uploadFile(req.file.buffer, "admin-avatars");
      admin.avatar = avatarUrl;
    }

    await admin.save();

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to updated password" });
  }
};

// Passowrd forgot------------------------>

// Send reset password email
const sendResetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await AdminModel.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not registered" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  console.log(resetToken);
  const resetUrl = `${process.env.ADMIN_URL}/auth/reset-password/${resetToken}`;
  const html = await ejs.renderFile(
    path.join(__dirname, "../emails/resetPassword.ejs"),
    { name: user.name, resetUrl }
  );

  await sendEmail({ to: user.email, subject: "Password Reset", html });
  await user.save();

  res.status(200).json({ message: "Please check your mail" });
};

// Reset password using token
const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await AdminModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword || password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Passwords do not match or are missing" });
  }
  
  // user.password = await bcrypt.hash(password, 10);
  user.password=password;
  console.log(user.password);
  
  // user.password = await
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  const html = await ejs.renderFile(
    path.join(__dirname, "../emails/passwordSuccessfull.ejs"),
    { user }
  );
  await sendEmail({ to: user.email, subject: "Password Reset Success", html });


  res.status(200).json({ message: "Password has been updated successfully" });
};

module.exports = {
  register,
  loginAdmin,
  updatePassword,
  resetPassword,
  sendResetPassword,
  updateProfile,
};
