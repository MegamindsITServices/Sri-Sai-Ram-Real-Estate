const router = require("express").Router();
const {
  register,
  resetPassword,
  sendResetPassword,
  updatePassword,
  updateProfile,
  loginAdmin,
} = require("../controllers/adminAuthController");
const { isAuth, authoriseRoles } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", loginAdmin);

router.put("/update-password", isAuth, updatePassword);
router.post("/update-profile", isAuth, updateProfile);

router.post("/forgot-password", sendResetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
