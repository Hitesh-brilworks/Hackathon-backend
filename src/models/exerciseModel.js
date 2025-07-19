const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    force: String,
    level: String,
    mechanic: String,
    equipment: String,
    primaryMuscles: [String],
    secondaryMuscles: [String],
    instructions: [String],
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
