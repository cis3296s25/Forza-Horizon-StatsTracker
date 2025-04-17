const express = require('express');
const router = express.Router();
const { newUser, loginUsers, logoutUsers, searchUsers, deleteUsers, getUsersList, requestReset} = require('../controllers/users');

// Define routes with controller functions
router.post("/newUser", newUser);
router.post("/login", loginUsers);
router.post("/logout", logoutUsers);
router.post("/search", searchUsers);
router.post("/request-reset", requestReset);
router.delete("/delete", deleteUsers);
router.get("/list", getUsersList);


module.exports = router;