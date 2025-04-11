const express = require('express');
const router = express.Router();
const {getUserStats,getProfileStats,getCompareStats, getAllUserStats} = require("../controllers/stats");
const verifyToken = require("../middlewares/verifyToken");

router.get("/stats",verifyToken,getUserStats);
router.get("/profile-stats",verifyToken, getProfileStats);
router.get('/compareStats', getCompareStats);
router.get('/allUserStats', getAllUserStats);


module.exports = router;