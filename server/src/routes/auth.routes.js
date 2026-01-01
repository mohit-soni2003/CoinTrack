const express = require("express");
const router = express.Router();

const {
  adminSignup,
  memberSignup,
  login
} = require("../controllers/auth.controller");

// Admin creates family + account
router.post("/admin/signup", adminSignup);

// Member joins existing family
router.post("/member/signup", memberSignup);

// Login (admin & member)
router.post("/login", login);

module.exports = router;
