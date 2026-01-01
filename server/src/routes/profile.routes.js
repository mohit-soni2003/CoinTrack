const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfilePhoto
} = require("../controllers/profile.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Get user profile
router.get("/", authMiddleware, getProfile);

// Update profile photo
router.put("/photo", authMiddleware, updateProfilePhoto);

module.exports = router;
