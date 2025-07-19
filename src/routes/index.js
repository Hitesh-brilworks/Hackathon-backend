const express = require("express");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const exerciseRoutes = require("./exerciseRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/exercises", exerciseRoutes);

module.exports = router;
