const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const expenseRoutes = require("./expense.routes");
const incomeRoutes = require("./income.routes");
const profileRoutes = require("./profile.routes");
const familyRoutes = require("./family.routes");


router.use("/auth", authRoutes);
router.use("/expense", expenseRoutes);
router.use("/income", incomeRoutes);
router.use("/profile", profileRoutes);
router.use("/family", familyRoutes);


module.exports = router;
