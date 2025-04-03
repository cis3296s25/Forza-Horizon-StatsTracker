const express = require('express');
const router = express.Router();
const {getUserStats,getProfileStats} = require("../controllers/stats")

router.get("/stats", getUserStats);
router.get("/profile-stats", getProfileStats);


module.exports = router;