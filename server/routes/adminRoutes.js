const router = require("express").Router();
const { getDashboardStats } = require("../controllers/adminController");
const { isAuth } = require("../middlewares/auth");

router.get("/dashboard-stats", isAuth, getDashboardStats);

module.exports = router;
