const express = require("express");
const router = express.Router();
const {
  getFamilyDetails,
  getFamilyMembers,
  getMemberProfile,
  getFamilyBalance
} = require("../controllers/family.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/family/details
 * Get complete family details including all members and profiles
 * Accessible by: Admin and Family Members
 */
router.get("/details", getFamilyDetails);

/**
 * GET /api/family/members
 * Get all family members with complete profile information
 * Accessible by: Admin and Family Members
 */
router.get("/members", getFamilyMembers);

/**
 * GET /api/family/members/:memberId
 * Get specific member profile with all details
 * Accessible by: Admin and Family Members (same family)
 */
router.get("/members/:memberId", getMemberProfile);

/**
 * GET /api/family/balance
 * Get family balance and member-wise balance breakdown
 * Accessible by: Admin and Family Members
 */
router.get("/balance", getFamilyBalance);

module.exports = router;
