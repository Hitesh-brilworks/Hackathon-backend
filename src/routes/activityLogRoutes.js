const express = require("express");
const activityLogController = require("../controllers/activityLogController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/activity/complete:
 *   post:
 *     summary: Complete a routine and log activity
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routineId
 *               - exercises
 *             properties:
 *               routineId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               exerciseId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Routine completed and logged successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Routine not found
 *       401:
 *         description: Unauthorized
 */
router.post("/complete", activityLogController.completeRoutine);

/**
 * @swagger
 * /api/activity/exercise-totals/weekly:
 *   get:
 *     summary: Get weekly totals for all exercises
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: exerciseName
 *         schema:
 *           type: string
 *         description: Filter by exercise name
 *     responses:
 *       200:
 *         description: Weekly exercise totals retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/exercise-totals/weekly",
  activityLogController.getWeeklyExerciseTotals
);

/**
 * @swagger
 * /api/activity/exercise-progress:
 *   get:
 *     summary: Get progress data for a specific exercise
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: exerciseName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Exercise progress data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/exercise-progress", activityLogController.getExerciseProgress);

/**
 * @swagger
 * /api/activity/history:
 *   get:
 *     summary: Get user's activity history
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, partial, skipped]
 *         description: Filter by workout status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Activity history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", activityLogController.getActivityHistory);

/**
 * @swagger
 * /api/activity/reports/weekly:
 *   get:
 *     summary: Get weekly activity report
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Weekly report generated successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/reports/weekly", activityLogController.getWeeklyReport);

module.exports = router;
