const WorkoutRoutine = require("../models/workoutRoutineModel");
const Exercise = require("../models/exerciseModel");
const ActivityLog = require("../models/activityLogModel");

// Create a new workout routine
const createRoutine = async (req, res) => {
  try {
    const { title, description, weekdays, exercises } = req.body;
    console.log("req.user", req.user);
    const userId = req.user._id;

    // Validate exercises exist
    const exerciseIds = exercises.map((ex) => ex.exerciseId);
    const existingExercises = await Exercise.find({
      _id: { $in: exerciseIds },
    });
    console.log("existingExercises", existingExercises);
    if (existingExercises.length !== exerciseIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more exercises not found",
      });
    }

    const routine = new WorkoutRoutine({
      userId,
      title,
      description,
      weekdays,
      exercises,
    });

    await routine.save();
    await routine.populate(
      "exercises.exerciseId",
      "name category equipment primaryMuscles"
    );

    res.status(201).json({
      success: true,
      message: "Workout routine created successfully",
      data: routine,
    });
  } catch (error) {
    console.log("data", data);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all routines for a user
const getUserRoutines = async (req, res) => {
  try {
    const userId = req.user._id;
    const { weekday, active } = req.query;

    let query = { userId };

    if (weekday) {
      query.weekdays = weekday;
    }

    if (active !== undefined) {
      query.isActive = active === "true";
    }

    const routines = await WorkoutRoutine.find(query)
      .populate(
        "exercises.exerciseId",
        "name category equipment primaryMuscles"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: routines.length,
      data: routines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific routine
const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const routine = await WorkoutRoutine.findOne({ _id: id, userId }).populate(
      "exercises.exerciseId",
      "name category equipment primaryMuscles instructions"
    );

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: routine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a routine
const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    // If exercises are being updated, validate they exist
    if (updates.exercises) {
      const exerciseIds = updates.exercises.map((ex) => ex.exerciseId);
      const existingExercises = await Exercise.find({
        _id: { $in: exerciseIds },
      });

      if (existingExercises.length !== exerciseIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more exercises not found",
        });
      }

      // Add order to exercises if not provided
      updates.exercises = updates.exercises.map((exercise, index) => ({
        ...exercise,
        order: exercise.order !== undefined ? exercise.order : index,
      }));
    }

    const routine = await WorkoutRoutine.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    ).populate(
      "exercises.exerciseId",
      "name category equipment primaryMuscles"
    );

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Routine updated successfully",
      data: routine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a routine
const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const routine = await WorkoutRoutine.findOneAndDelete({ _id: id, userId });

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Routine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get routines by weekday
const getRoutinesByWeekday = async (req, res) => {
  try {
    const { weekday } = req.params;
    const userId = req.user._id;

    const routines = await WorkoutRoutine.find({
      userId,
      weekdays: weekday,
      isActive: true,
    }).populate(
      "exercises.exerciseId",
      "name category equipment primaryMuscles"
    );
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const activityLogs = await ActivityLog.find({
      userId,
      completedDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const completedExerciseMap = new Map();
    activityLogs.forEach((log) => {
      completedExerciseMap.set(`${log.routineId}_${log.exerciseId}`, true);
    });
    const routinesWithCompletedFlag = routines.map((routine) => {
      const updatedExercises = routine.exercises.map((exercise) => {
        const isCompleted = completedExerciseMap.has(
          `${routine?._id}_${exercise?.exerciseId?._id}`
        );
        return {
          ...exercise.toObject(),
          completed: isCompleted,
        };
      });

      return {
        ...routine.toObject(),
        exercises: updatedExercises,
      };
    });

    res.status(200).json({
      success: true,
      count: routines.length,
      data: routinesWithCompletedFlag,
    });
    // res.status(200).json({
    //   success: true,
    //   count: routines.length,
    //   data: routines,
    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoutine,
  getUserRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
  getRoutinesByWeekday,
};
