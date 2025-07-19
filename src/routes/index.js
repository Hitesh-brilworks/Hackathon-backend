const express = require("express");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const authRoutes = require("./authRoutes");
const workoutRoutineRoutes = require("./workoutRoutineRoutes");
const activityLogRoutes = require("./activityLogRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/routines", workoutRoutineRoutes);
router.use("/activity", activityLogRoutes);

module.exports = router;
