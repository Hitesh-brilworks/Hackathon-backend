const express = require("express");
const exerciseController = require("../controllers/exerciseController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Side Laterals to Front Raise"
 *         force:
 *           type: string
 *           enum: [push, pull, static]
 *           example: "push"
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, expert]
 *           example: "beginner"
 *         mechanic:
 *           type: string
 *           enum: [isolation, compound]
 *           example: "isolation"
 *         equipment:
 *           type: string
 *           example: "dumbbell"
 *         primaryMuscles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["shoulders"]
 *         secondaryMuscles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["traps"]
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["In a standing position, hold a pair of dumbbells at your side."]
 *         category:
 *           type: string
 *           example: "strength"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     description: Retrieve all exercises from the database
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Successfully retrieved all exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 150
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get("/", exerciseController.getAllExercises);
// router.post("/", exerciseController.importExercises);

module.exports = router;
