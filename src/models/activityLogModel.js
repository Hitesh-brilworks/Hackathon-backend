const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutRoutine",
      required: true,
    },
    routineTitle: {
      type: String,
      required: true,
    },
    routineDescription: {
      type: String,
    },

    completedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutRoutine",
      required: true,
    },

    totalWorkoutTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
