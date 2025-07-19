const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    maxlength: [50, "Full name cannot exceed 50 characters"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    max: [120, "Age cannot exceed 120"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female", "Other", "Prefer not to say"],
      message: "Gender must be one of: Male, Female, Other, Prefer not to say",
    },
  },
  height: {
    unit: {
      type: String,
      required: [true, "Height unit is required"],
      enum: {
        values: ["cm", "ft"],
        message: "Height unit must be either cm or ft",
      },
    },
    // For cm: store total centimeters
    cm: {
      type: Number,
      min: [50, "Height must be at least 50cm"],
      max: [300, "Height cannot exceed 300cm"],
      required: function () {
        return this.height.unit === "cm";
      },
    },
    // For ft: store feet and inches separately
    feet: {
      type: Number,
      min: [1, "Height must be at least 1 foot"],
      max: [9, "Height cannot exceed 9 feet"],
      required: function () {
        return this.height.unit === "ft";
      },
    },
    inches: {
      type: Number,
      default: 0,
      min: [0, "Inches cannot be negative"],
      max: [11, "Inches cannot exceed 11"],
      required: function () {
        return this.height.unit === "ft";
      },
    },
  },
  weight: {
    value: {
      type: Number,
      required: [true, "Weight value is required"],
      min: [1, "Weight must be positive"],
    },
    unit: {
      type: String,
      required: [true, "Weight unit is required"],
      enum: {
        values: ["kg", "lb"],
        message: "Weight unit must be either kg or lb",
      },
    },
  },
  fitnessGoal: {
    type: String,
    required: [true, "Fitness goal is required"],
    enum: {
      values: [
        "Lose Weight",
        "Gain Muscle",
        "Improve Endurance",
        "Maintain Weight",
        "Increase Flexibility",
        "Build Strength",
        "General Fitness",
      ],
      message: "Please select a valid fitness goal",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
