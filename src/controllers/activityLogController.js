const ActivityLog = require("../models/activityLogModel");
const WorkoutRoutine = require("../models/workoutRoutineModel");

// Complete a routine and log activity
const completeRoutine = async (req, res) => {
  try {
    const { routineId, exerciseId } = req.body;
    const userId = req.user._id;

    // Get the original routine
    const routine = await WorkoutRoutine.findOne({
      _id: routineId,
      userId,
      "exercises.exerciseId": exerciseId,
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    // Create activity log
    const activityLog = new ActivityLog({
      userId,
      routineId,
      routineTitle: routine.title,
      routineDescription: routine.description,
      completedDate: new Date().toDateString(),
      weekday: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      exerciseId,
    });

    await activityLog.save();

    res.status(201).json({
      success: true,
      message: "Routine completed and logged successfully",
      data: activityLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWeeklyExerciseTotals = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      day.setHours(0, 0, 0, 0);
      weekDays.push(new Date(day));
    }

    const progressData = [];

    for (const day of weekDays) {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      // Get all activity logs for the user on that day
      const logs = await ActivityLog.find({
        userId,
        completedDate: {
          $gte: day,
          $lt: nextDay,
        },
      });

      let completedExercises = logs.length;
      let totalExercises = 0;
      let routineTitle = "";

      if (logs.length > 0) {
        const routine = await WorkoutRoutine.findOne({
          _id: logs[0].routineId,
          userId,
        });

        if (routine) {
          totalExercises = routine.exercises.length;
          routineTitle = routine.title;
        }
      }

      const completionPercentage =
        totalExercises > 0
          ? ((completedExercises / totalExercises) * 100).toFixed(2)
          : 0;

      progressData.push({
        date: day.toISOString().split("T")[0],
        day: day.toLocaleDateString("en-US", { weekday: "long" }),
        routineTitle,
        completedExercises,
        totalExercises,
        completionPercentage: Number(completionPercentage),
      });
    }

    return res.status(200).json({
      success: true,
      weekStart: startOfWeek.toISOString().split("T")[0],
      weekEnd: endOfWeek.toISOString().split("T")[0],
      data: progressData,
    });
  } catch (error) {
    console.error("Weekly progress error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get weekly report with exercise breakdown
const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const activities = await ActivityLog.find({
      userId,
      completedDate: { $gte: start, $lte: end },
    });

    // Calculate exercise totals for the week
    const exerciseStats = {};
    activities.forEach((activity) => {
      activity.exercises.forEach((exercise) => {
        const key = exercise.name;
        if (!exerciseStats[key]) {
          exerciseStats[key] = {
            name: exercise.name,
            exerciseId: exercise.exerciseId,
            totalSets: 0,
            totalReps: 0,
            totalVolume: 0,
            workoutCount: 0,
            sessions: [],
          };
        }
        exerciseStats[key].totalSets += exercise.totalSets;
        exerciseStats[key].totalReps += exercise.totalReps;
        exerciseStats[key].totalVolume += exercise.totalVolume;
        exerciseStats[key].workoutCount += 1;
        exerciseStats[key].sessions.push({
          date: activity.completedDate,
          sets: exercise.sets,
          totalSets: exercise.totalSets,
          totalReps: exercise.totalReps,
          totalVolume: exercise.totalVolume,
        });
      });
    });

    const report = {
      period: { start, end },
      summary: {
        totalWorkouts: activities.length,
        totalSets: activities.reduce(
          (sum, activity) => sum + activity.totalSets,
          0
        ),
        totalReps: activities.reduce(
          (sum, activity) => sum + activity.totalReps,
          0
        ),
        totalVolume: activities.reduce(
          (sum, activity) => sum + activity.totalVolume,
          0
        ),
        totalTime: activities.reduce(
          (sum, activity) => sum + activity.totalWorkoutTime,
          0
        ),
      },
      exerciseBreakdown: Object.values(exerciseStats).sort(
        (a, b) => b.totalVolume - a.totalVolume
      ),
      dailyBreakdown: activities.reduce((breakdown, activity) => {
        const day = activity.weekday;
        if (!breakdown[day]) {
          breakdown[day] = {
            count: 0,
            sets: 0,
            reps: 0,
            volume: 0,
            time: 0,
          };
        }
        breakdown[day].count++;
        breakdown[day].sets += activity.totalSets;
        breakdown[day].reps += activity.totalReps;
        breakdown[day].volume += activity.totalVolume;
        breakdown[day].time += activity.totalWorkoutTime;
        return breakdown;
      }, {}),
    };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get exercise progress over time
const getExerciseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { exerciseName, startDate, endDate } = req.query;

    if (!exerciseName) {
      return res.status(400).json({
        success: false,
        message: "Exercise name is required",
      });
    }

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const activities = await ActivityLog.find({
      userId,
      completedDate: { $gte: start, $lte: end },
      "exercises.name": { $regex: exerciseName, $options: "i" },
    }).sort({ completedDate: 1 });

    const progressData = activities.map((activity) => {
      const exercise = activity.exercises.find((ex) =>
        ex.name.toLowerCase().includes(exerciseName.toLowerCase())
      );

      return {
        date: activity.completedDate,
        routineTitle: activity.routineTitle,
        sets: exercise.sets,
        totalSets: exercise.totalSets,
        totalReps: exercise.totalReps,
        totalVolume: exercise.totalVolume,
        maxWeight: Math.max(...exercise.sets.map((set) => set.kg)),
        averageWeight:
          exercise.sets.reduce((sum, set) => sum + set.kg, 0) /
          exercise.sets.length,
      };
    });

    res.status(200).json({
      success: true,
      exerciseName,
      period: { start, end },
      data: progressData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get activity history with pagination and filters
const getActivityHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    // Build query
    let query = { userId };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.completedDate = {};
      if (startDate) query.completedDate.$gte = new Date(startDate);
      if (endDate) query.completedDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get activities with pagination
    const activities = await ActivityLog.find(query)
      .sort({ completedDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("routineId", "title description");

    // Get total count for pagination
    const totalCount = await ActivityLog.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  completeRoutine,
  getActivityHistory,
  getWeeklyReport,
  getWeeklyExerciseTotals,
  getExerciseProgress,
};
