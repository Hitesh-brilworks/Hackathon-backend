const express = require("express");
const workoutRoutineController = require("../controllers/workoutRoutineController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication to all routes

/**
 * @swagger
 * components:
 *   schemas:
 *     Set:
 *       type: object
 *       required:
 *         - kg
 *         - reps
 *       properties:
 *         kg:
 *           type: number
 *           minimum: 0
 *           example: 45
 *         reps:
 *           type: number
 *           minimum: 1
 *           example: 10
 *     RoutineExercise:
 *       type: object
 *       required:
 *         - exerciseId
 *         - sets
 *       properties:
 *         exerciseId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         sets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Set'
 *           minItems: 1
 *         order:
 *           type: number
 *           minimum: 0
 *           example: 0
 *     WorkoutRoutine:
 *       type: object
 *       required:
 *         - title
 *         - weekdays
 *         - exercises
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           maxLength: 50
 *           example: "Push Day"
 *         weekdays:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *           minItems: 1
 *           example: ["Monday", "Wednesday", "Friday"]
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoutineExercise'
 *           minItems: 1
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/routines:
 *   post:
 *     summary: Create a new workout routine
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - weekdays
 *               - exercises
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Push Day"
 *               weekdays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Monday", "Wednesday"]
 *               exercises:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/RoutineExercise'
 *           example:
 *             title: "Push Day"
 *             weekdays: ["Monday", "Wednesday"]
 *             exercises:
 *               - exerciseId: "507f1f77bcf86cd799439011"
 *                 sets:
 *                   - kg: 45
 *                     reps: 10
 *                   - kg: 45
 *                     reps: 8
 *                 order: 0
 *     responses:
 *       201:
 *         description: Routine created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", workoutRoutineController.createRoutine);

/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Get all user's workout routines
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weekday
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *         description: Filter by weekday
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Routines retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", workoutRoutineController.getUserRoutines);

/**
 * @swagger
 * /api/routines/weekday/{weekday}:
 *   get:
 *     summary: Get routines for a specific weekday
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weekday
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *     responses:
 *       200:
 *         description: Routines retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/weekday/:weekday", workoutRoutineController.getRoutinesByWeekday);

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Get a specific workout routine
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Routine retrieved successfully
 *       404:
 *         description: Routine not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", workoutRoutineController.getRoutineById);

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Update a workout routine
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutRoutine'
 *     responses:
 *       200:
 *         description: Routine updated successfully
 *       404:
 *         description: Routine not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", workoutRoutineController.updateRoutine);

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Delete a workout routine
 *     tags: [Workout Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Routine deleted successfully
 *       404:
 *         description: Routine not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", workoutRoutineController.deleteRoutine);

module.exports = router;
