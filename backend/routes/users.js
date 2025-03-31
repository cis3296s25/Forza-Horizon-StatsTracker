const express = require('express');
const router = express.Router();
const { newUser, loginUsers, logoutUsers, searchUsers, updateUsers, deleteUsers, getUserStats } = require('../controllers/users');

// Define routes with controller functions
router.post("/newUser", newUser);
router.post("/login", loginUsers);
router.post("/logout", logoutUsers);
router.post("/search", searchUsers);
router.post("/update", updateUsers);
router.delete("/delete", deleteUsers);
router.get("/stats", getUserStats);
//router.get('/compare',compareUsers);

module.exports = router;

