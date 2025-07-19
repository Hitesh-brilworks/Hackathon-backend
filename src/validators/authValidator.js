const { z } = require("zod");
const { createError } = require("../utils/errorUtils");

const registerSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password cannot exceed 128 characters"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name cannot exceed 25 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name cannot exceed 25 characters")
    .trim(),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(13, "Age must be at least 13")
    .max(120, "Age cannot exceed 120"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    errorMap: () => ({
      message: "Gender must be one of: Male, Female, Other, Prefer not to say",
    }),
  }),

  height: z
    .object({
      unit: z.enum(["cm", "ft"], {
        errorMap: () => ({ message: "Height unit must be either cm or ft" }),
      }),
      cm: z.coerce
        .number()
        .min(50, "Height must be at least 50cm")
        .max(300, "Height cannot exceed 300cm")
        .optional(),
      feet: z.coerce
        .number()
        .min(1, "Height must be at least 1 foot")
        .max(9, "Height cannot exceed 9 feet")
        .optional(),
      inches: z.coerce
        .number()
        .min(0, "Inches cannot be negative")
        .max(11, "Inches cannot exceed 11")
        .optional()
        .default(0),
    })
    .refine(
      (data) => {
        if (data.unit === "cm") {
          return data.cm !== undefined && data.cm >= 50 && data.cm <= 300;
        } else if (data.unit === "ft") {
          return (
            data.feet !== undefined &&
            data.feet >= 1 &&
            data.feet <= 9 &&
            data.inches !== undefined &&
            data.inches >= 0 &&
            data.inches <= 11
          );
        }
        return false;
      },
      {
        message:
          "Invalid height: cm required when unit is cm, feet and inches required when unit is ft",
      }
    ),
  weight: z.object({
    value: z.coerce.number().positive("Weight must be positive"),
    unit: z.enum(["kg", "lb"], {
      errorMap: () => ({ message: "Weight unit must be either kg or lb" }),
    }),
  }),
  fitnessGoal: z.enum(
    [
      "Lose Weight",
      "Gain Muscle",
      "Improve Endurance",
      "Maintain Weight",
      "Increase Flexibility",
      "Build Strength",
      "General Fitness",
    ],
    {
      errorMap: () => ({ message: "Please select a valid fitness goal" }),
    }
  ),
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({
      message: "Fitness level must be one of: Beginner, Intermediate, Advanced",
    }),
  }),
  workoutFrequency: z.enum(
    ["1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"],
    {
      errorMap: () => ({
        message:
          "Workout frequency must be one of: 1-2 times per week, 3-4 times per week, 5-6 times per week, Daily",
      }),
    }
  ),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const validateRegister = (data) => {
  try {
    return registerSchema.parse(data);
  } catch (error) {
    const validationErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw createError("Validation failed", 400, null, { validationErrors });
  }
};

const validateLogin = (data) => {
  try {
    return loginSchema.parse(data);
  } catch (error) {
    const validationErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw createError("Validation failed", 400, null, { validationErrors });
  }
};

module.exports = {
  validateRegister,
  validateLogin,
};
