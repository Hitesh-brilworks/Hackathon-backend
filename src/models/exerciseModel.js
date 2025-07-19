const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    force: {
      type: String,
      enum: ["push", "pull", "static"],
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    mechanic: {
      type: String,
      enum: ["isolation", "compound"],
      required: true,
    },
    equipment: {
      type: String,
      required: true,
      trim: true,
    },
    primaryMuscles: [
      {
        type: String,
        required: true,
      },
    ],
    secondaryMuscles: [
      {
        type: String,
      },
    ],
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
