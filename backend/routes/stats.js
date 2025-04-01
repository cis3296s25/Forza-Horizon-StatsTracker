const express = require('express');
const router = express.Router();
const {getUserStats} = require("../controllers/stats");

router.get("/stats", getUserStats);


module.exports = router;