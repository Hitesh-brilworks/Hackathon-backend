const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  kg: {
    type: Number,
    required: [true, "Weight is required"],
    min: [0, "Weight cannot be negative"],
  },
  reps: {
    type: Number,
    required: [true, "Reps is required"],
    min: [1, "Reps must be at least 1"],
  },
});

const routineExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: [true, "Exercise is required"],
  },
  sets: {
    type: [setSchema],
    required: [true, "At least one set is required"],
    validate: {
      validator: function (sets) {
        return sets && sets.length > 0;
      },
      message: "At least one set is required",
    },
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
});

const workoutRoutineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    title: {
      type: String,
      required: [true, "Routine title is required"],
      trim: true,
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    weekdays: {
      type: [String],
      required: [true, "At least one weekday is required"],
      enum: {
        values: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        message: "Invalid weekday",
      },
      validate: {
        validator: function (weekdays) {
          return weekdays && weekdays.length > 0;
        },
        message: "At least one weekday must be selected",
      },
    },
    exercises: {
      type: [routineExerciseSchema],
      required: [true, "At least one exercise is required"],
      validate: {
        validator: function (exercises) {
          return exercises && exercises.length > 0;
        },
        message: "At least one exercise is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient queries
workoutRoutineSchema.index({ userId: 1, weekdays: 1 });
workoutRoutineSchema.index({ userId: 1, title: 1 });

// Virtual to populate exercise details
workoutRoutineSchema.virtual("exerciseDetails", {
  ref: "Exercise",
  localField: "exercises.exerciseId",
  foreignField: "_id",
});

module.exports = mongoose.model("WorkoutRoutine", workoutRoutineSchema);
