const Exercise = require("../models/exerciseModel");
const exercises = require("../config/exercises.json");

// const importExercises = async (req, res) => {
//   try {
//     await Exercise.deleteMany({});
//     await Exercise.insertMany(exercises.exercises);
//     res.status(200).json({
//       message: `Successfully imported ${exercises.exercises.length} exercises`,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getAllExercises = async (req, res) => {
  try {
    const { search, primaryMuscles } = req.query;

    // Build query object
    let query = {};

    // Add search filter (case-insensitive search in name)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Add primaryMuscles filter
    if (primaryMuscles) {
      query.primaryMuscles = { $in: [primaryMuscles] };
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Exercise.distinct("category");
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.sort(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPrimaryMuscles = async (req, res) => {
  try {
    const primaryMuscles = await Exercise.distinct("primaryMuscles");
    res.status(200).json({
      success: true,
      count: primaryMuscles.length,
      data: primaryMuscles.sort(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllExercises, getAllCategories, getAllPrimaryMuscles };
