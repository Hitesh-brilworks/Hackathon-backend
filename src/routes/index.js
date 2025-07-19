const express = require("express");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/exercises", exerciseRoutes);

module.exports = router;
