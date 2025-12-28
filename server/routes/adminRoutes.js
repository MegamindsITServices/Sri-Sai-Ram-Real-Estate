const router = require("express").Router();
const {
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
} = require("../controllers/adminController");
const { isAuth, authoriseRoles } = require("../middlewares/auth");

router.use(isAuth, authoriseRoles("admin")); 

router.get("/dashboard-stats", isAuth, getDashboardStats);

router.get("/admins", getAllAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);
router.put("/admins/:id/password", changeAdminPassword);

module.exports = router;
