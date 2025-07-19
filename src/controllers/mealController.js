const Meal = require("../models/mealModel");
const meals = require("../config/nutritions.json");

const importMeals = async (req, res) => {
  try {
    await Meal.deleteMany({});

    // Remove the 'id' field from each meal before inserting
    const processedMeals = meals.meals.map((meal) => {
      const { id, ...mealWithoutId } = meal;
      return mealWithoutId;
    });

    await Meal.insertMany(processedMeals);
    res.status(200).json({
      message: `Successfully imported ${processedMeals.length} meals`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { importMeals, getAllMeals };
