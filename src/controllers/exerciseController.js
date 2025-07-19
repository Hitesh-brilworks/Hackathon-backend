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
    const exercises = await Exercise.find({}).sort({ name: 1 });
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

module.exports = { getAllExercises, getAllCategories };
