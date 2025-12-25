const router=require("express").Router();
const {putMsg,getMsg, getPaginatedMessages, deleteMsg}=require("../controllers/messageController");

router.post("/putMsg",putMsg);
router.get("/getmsg",getMsg)
router.get("/paginated", getPaginatedMessages);
router.post("/deleteMsg", deleteMsg);
module.exports =router