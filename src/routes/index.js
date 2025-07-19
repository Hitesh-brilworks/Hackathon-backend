const express = require("express");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const authRoutes = require("./authRoutes");
const workoutRoutineRoutes = require("./workoutRoutineRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/routines", workoutRoutineRoutes);

module.exports = router;
