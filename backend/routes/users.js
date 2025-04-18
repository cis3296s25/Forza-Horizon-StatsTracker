const express = require('express');
const router = express.Router();
const multer = require("multer");
const { newUser, loginUsers, logoutUsers, searchUsers, deleteUsers, getUsersList, requestReset,resetPassword } = require('../controllers/users');
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Define routes with controller functions
router.post("/newUser", upload.array("images", 2), newUser);
router.post("/login", loginUsers);
router.post("/logout", logoutUsers);
router.post("/search", searchUsers);
router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);
router.delete("/delete", deleteUsers);
router.get("/list", getUsersList);

module.exports = router;