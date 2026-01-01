const Family = require("../models/family");
const User = require("../models/user");

/**
 * Get all family details including all members and their profiles
 * Accessible by any authenticated family member or admin
 */
const getFamilyDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find family by the current user's family ID
    const family = await Family.findOne({
      $or: [
        { adminId: userId },
        { members: userId }
      ]
    })
      .populate({
        path: "adminId",
        select: "name email role profilePhoto balance createdAt"
      })
      .populate({
        path: "members",
        select: "name email role profilePhoto balance createdAt"
      });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Family details retrieved successfully",
      data: {
        familyId: family._id,
        familyName: family.familyName,
        balance: family.balance,
        admin: family.adminId,
        members: family.members,
        totalMembers: family.members.length + 1, // +1 for admin
        createdAt: family.createdAt,
        updatedAt: family.updatedAt
      }
    });
  } catch (error) {
    console.error("Get Family Details Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

/**
 * Get all family members with complete profile details
 * Accessible by any authenticated family member or admin
 */
const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find family by the current user's family ID
    const family = await Family.findOne({
      $or: [
        { adminId: userId },
        { members: userId }
      ]
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    // Get all member details including admin
    const memberIds = [family.adminId, ...family.members];
    const memberDetails = await User.find(
      { _id: { $in: memberIds } },
      "name email role profilePhoto balance createdAt"
    );

    // Separate admin and regular members
    const admin = memberDetails.find(m => m._id.toString() === family.adminId.toString());
    const members = memberDetails.filter(m => m._id.toString() !== family.adminId.toString());

    return res.status(200).json({
      success: true,
      message: "Family members retrieved successfully",
      data: {
        familyId: family._id,
        familyName: family.familyName,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          profilePhoto: admin.profilePhoto,
          balance: admin.balance,
          joinedAt: admin.createdAt
        },
        members: members.map(member => ({
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          profilePhoto: member.profilePhoto,
          balance: member.balance,
          joinedAt: member.createdAt
        })),
        totalMembers: memberDetails.length
      }
    });
  } catch (error) {
    console.error("Get Family Members Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

/**
 * Get specific member profile with all details
 * Accessible by any authenticated family member or admin
 */
const getMemberProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;

    // Verify user is part of a family
    const family = await Family.findOne({
      $or: [
        { adminId: userId },
        { members: userId }
      ]
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    // Verify memberId is part of the same family
    const isMember = family.members.some(m => m.toString() === memberId) || 
                     family.adminId.toString() === memberId;

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Member not part of your family"
      });
    }

    // Get member profile
    const memberProfile = await User.findById(memberId, {
      password: 0
    });

    if (!memberProfile) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member profile retrieved successfully",
      data: {
        _id: memberProfile._id,
        name: memberProfile.name,
        email: memberProfile.email,
        role: memberProfile.role,
        profilePhoto: memberProfile.profilePhoto,
        balance: memberProfile.balance,
        joinedAt: memberProfile.createdAt,
        lastUpdated: memberProfile.updatedAt
      }
    });
  } catch (error) {
    console.error("Get Member Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

/**
 * Get family balance and member-wise breakdown
 * Accessible by any authenticated family member or admin
 */
const getFamilyBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find family by the current user's family ID
    const family = await Family.findOne({
      $or: [
        { adminId: userId },
        { members: userId }
      ]
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    // Get all members with balance
    const memberIds = [family.adminId, ...family.members];
    const memberBalances = await User.find(
      { _id: { $in: memberIds } },
      "name email profilePhoto balance"
    );

    const totalBalance = memberBalances.reduce((sum, member) => sum + member.balance, 0);

    return res.status(200).json({
      success: true,
      message: "Family balance retrieved successfully",
      data: {
        familyId: family._id,
        familyName: family.familyName,
        totalFamilyBalance: family.balance,
        totalMembersBalance: totalBalance,
        memberBalances: memberBalances.map(member => ({
          memberId: member._id,
          name: member.name,
          email: member.email,
          profilePhoto: member.profilePhoto,
          balance: member.balance
        }))
      }
    });
  } catch (error) {
    console.error("Get Family Balance Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  getFamilyDetails,
  getFamilyMembers,
  getMemberProfile,
  getFamilyBalance
};
