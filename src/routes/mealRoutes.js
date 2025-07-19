const express = require("express");
const mealController = require("../controllers/mealController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Grilled Chicken Breast with Quinoa"
 *         category:
 *           type: string
 *           example: "protein"
 *         calories:
 *           type: number
 *           example: 350
 *         protein:
 *           type: number
 *           example: 45
 *         carbs:
 *           type: number
 *           example: 25
 *         fat:
 *           type: number
 *           example: 8
 *         fiber:
 *           type: number
 *           example: 4
 *         sugar:
 *           type: number
 *           example: 2
 *         sodium:
 *           type: number
 *           example: 280
 *         image:
 *           type: string
 *           example: "https://images.unsplash.com/photo-1603133872878-684f208fb84b"
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           example: ["chicken breast", "quinoa", "olive oil", "herbs", "lemon"]
 *         dietary_restrictions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gluten-free", "dairy-free"]
 *         workout_recommendations:
 *           type: array
 *           items:
 *             type: string
 *           example: ["strength training", "legs", "upper body"]
 *         meal_type:
 *           type: string
 *           example: "lunch"
 *         prep_time:
 *           type: number
 *           example: 25
 *         difficulty:
 *           type: string
 *           example: "easy"
 *         description:
 *           type: string
 *           example: "Lean protein with complex carbs perfect for muscle recovery"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/meals:
 *   get:
 *     summary: Get all meals
 *     description: Retrieve all meals from the database
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: Successfully retrieved meals
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
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Server error
 */
router.get("/", mealController.getAllMeals);
router.post("/", mealController.importMeals);

module.exports = router;
