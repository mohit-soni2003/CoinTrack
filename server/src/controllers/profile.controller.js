const User = require("../models/user");

/**
 * GET /api/profile
 * Get user profile information
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile retrieved successfully", user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

/**
 * PUT /api/profile/photo
 * Update user profile photo
 */
exports.updateProfilePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ message: "Photo URL is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile photo updated successfully", 
      user 
    });
  } catch (error) {
    console.error("Update Profile Photo Error:", error);
    res.status(500).json({ message: "Failed to update profile photo" });
  }
};
