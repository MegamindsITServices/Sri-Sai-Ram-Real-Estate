const router=require('express').Router();

const {
  create,
  allProjects,
  update,
  deleteProject,
  incrementProjectView,
  getProject,
  getPaginatedProjects,showcase,
  getShowcase,
  adminAllProjects,
  getAlsoLikeProjects,
  topProjects,
} = require("../controllers/projectController");


router.post('/create',create);
router.get('/getAll',allProjects);
router.get('/top-projects',topProjects);
router.get('/getAll/admin',adminAllProjects);
router.post('/update',update);
router.post("/delete",deleteProject)
router.post("/incrementProjectView",incrementProjectView)
router.post("/getProject",getProject);
router.post("/showcase",showcase);
router.get("/getShowcase",getShowcase)
router.get("/paginated", getPaginatedProjects);
router.get("/also-like/:id", getAlsoLikeProjects);
module.exports=router;