const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  kg: {
    type: Number,
    required: true,
    min: 0,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
});

const activityExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sets: [setSchema],
  totalSets: {
    type: Number,
    default: 0,
  },
  totalReps: {
    type: Number,
    default: 0,
  },
  totalVolume: {
    type: Number,
    default: 0,
  },
});

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
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    completedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weekday: {
      type: String,
      required: true,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    exercises: [activityExerciseSchema],
    totalWorkoutTime: {
      type: Number, // in minutes
      default: 0,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    totalSets: {
      type: Number,
      default: 0,
    },
    totalReps: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "partial", "skipped"],
      default: "completed",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
activityLogSchema.index({ userId: 1, completedDate: -1 });
activityLogSchema.index({ userId: 1, weekday: 1 });
activityLogSchema.index({ userId: 1, "exercises.exerciseId": 1 });
activityLogSchema.index({ userId: 1, "exercises.name": 1 });

// Calculate totals before saving
activityLogSchema.pre("save", function (next) {
  let workoutTotalSets = 0;
  let workoutTotalReps = 0;
  let workoutTotalVolume = 0;

  this.exercises.forEach((exercise) => {
    exercise.totalSets = exercise.sets.length;
    exercise.totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
    exercise.totalVolume = exercise.sets.reduce(
      (sum, set) => sum + set.kg * set.reps,
      0
    );

    workoutTotalSets += exercise.totalSets;
    workoutTotalReps += exercise.totalReps;
    workoutTotalVolume += exercise.totalVolume;
  });

  this.totalSets = workoutTotalSets;
  this.totalReps = workoutTotalReps;
  this.totalVolume = workoutTotalVolume;

  next();
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
