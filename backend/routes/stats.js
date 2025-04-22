const express = require('express');
const router = express.Router();

const {getUserStats,getProfileStats,getCompareStats,updateUserStats,getAllUserStats} = require("../controllers/stats");



const verifyToken = require("../middlewares/verifyToken");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get("/stats",verifyToken,getUserStats);
router.get("/profile-stats",verifyToken, getProfileStats);
router.get('/compareStats', getCompareStats);
router.get('/allUserStats', getAllUserStats);

router.put('/updateStats',verifyToken, upload.array("images", 2),updateUserStats);


module.exports = router;