const User = require("../models/user");
const Family = require("../models/family");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Create an admin user and a new family.
 *
 * Expected request body:
 * - `name` {string} - admin user's name
 * - `email` {string} - admin user's email (unique)
 * - `password` {string} - plaintext password (will be hashed)
 * - `familyName` {string} - name for the new family
 *
 * Response: 201 JSON with `token` and created `admin` object.
 *
 * Errors: throws if required fields are missing, user creation fails,
 * or database operations error. Caller should handle errors and set
 * appropriate status codes (e.g., 400/409/500).
 */
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, familyName, startingBalance, familyCode } = req.body;

    // Prevent duplicate email at API level
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      balance: startingBalance || 0
    });

    // Ensure familyCode is unique if provided, otherwise generate a 6-character code
    let code = familyCode && String(familyCode).trim() !== '' ? String(familyCode).trim() : null;
    if (code) {
      const existingCode = await Family.findOne({ familyCode: code });
      if (existingCode) return res.status(409).json({ message: 'familyCode already in use' });
    } else {
      // generate a compact alphanumeric code (retry if collision)
      const generateCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
      let attempts = 0;
      do {
        code = generateCode();
        attempts++;
        // avoid infinite loop - though collision chance is very small
        if (attempts > 10) break;
      } while (await Family.findOne({ familyCode: code }));
    }

    const family = await Family.create({
      familyName,
      adminId: admin._id,
      members: [admin._id],
      familyCode: code
    });

    admin.familyId = family._id;
    await admin.save();

    if (!JWT_SECRET) return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    const token = jwt.sign({ id: admin._id }, JWT_SECRET);

    res.status(201).json({ token, admin });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: "Email already in use" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a family member user and add them to an existing family.
 *
 * Expected request body:
 * - `name` {string} - member's name
 * - `email` {string} - member's email (unique)
 * - `password` {string} - plaintext password (will be hashed)
 * - `familyId` {string} - ObjectId of an existing Family
 *
 * Response: 201 JSON with `token` and created `member` object.
 *
 * Errors: throws if required fields are missing, `familyId` is invalid,
 * or DB operations fail. Upstream error handler should convert thrown
 * errors into HTTP responses.
 */
exports.memberSignup = async (req, res) => {
  try {
    const { name, email, password, familyCode, startingBalance } = req.body;

    // Prevent duplicate email at API level
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: "MEMBER",
      balance: startingBalance || 0
    };

    // familyCode is required for member signup
    if (!familyCode || String(familyCode).trim() === '') {
      return res.status(400).json({ message: 'familyCode is required for signup' });
    }

    const family = await Family.findOne({ familyCode: String(familyCode).trim() });
    if (!family) return res.status(400).json({ message: 'Invalid familyCode' });
    userData.familyId = family._id;

    const member = await User.create(userData);

    // Add member to family members array
    await Family.findByIdAndUpdate(userData.familyId, {
      $addToSet: { members: member._id }
    });

    if (!JWT_SECRET) return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    const token = jwt.sign({ id: member._id }, JWT_SECRET);

    res.status(201).json({ token, member });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: "Email already in use" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (!JWT_SECRET) return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
  const token = jwt.sign({ id: user._id }, JWT_SECRET);

  res.json({ token, user });
};
