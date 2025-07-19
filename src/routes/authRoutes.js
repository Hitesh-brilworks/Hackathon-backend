const express = require("express");
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - age
 *         - gender
 *         - height
 *         - weight
 *         - fitnessGoal
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "password123"
 *         fullName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "John Doe"
 *         age:
 *           type: integer
 *           minimum: 13
 *           maximum: 120
 *           example: 25
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other, "Prefer not to say"]
 *           example: "Male"
 *         height:
 *           type: object
 *           required:
 *             - unit
 *           properties:
 *             unit:
 *               type: string
 *               enum: [cm, ft]
 *               description: "Height unit - cm (centimeters) or ft (feet)"
 *               example: "cm"
 *             cm:
 *               type: number
 *               minimum: 50
 *               maximum: 300
 *               description: "Height in centimeters (required when unit is cm)"
 *               example: 175
 *             feet:
 *               type: number
 *               minimum: 1
 *               maximum: 9
 *               description: "Height in feet (required when unit is ft)"
 *               example: 5
 *             inches:
 *               type: number
 *               minimum: 0
 *               maximum: 11
 *               default: 0
 *               description: "Additional inches (required when unit is ft, must be 0-11)"
 *               example: 9
 *           examples:
 *             centimeters:
 *               summary: Height in centimeters
 *               value:
 *                 unit: "cm"
 *                 cm: 175
 *             feet_inches:
 *               summary: Height in feet and inches
 *               value:
 *                 unit: "ft"
 *                 feet: 5
 *                 inches: 9
 *         weight:
 *           type: object
 *           required:
 *             - value
 *             - unit
 *           properties:
 *             value:
 *               type: number
 *               minimum: 1
 *               description: "Weight value (must be positive)"
 *               example: 70
 *             unit:
 *               type: string
 *               enum: [kg, lb]
 *               description: "Weight unit - kg (kilograms) or lb (pounds)"
 *               example: "kg"
 *           examples:
 *             kilograms:
 *               summary: Weight in kilograms
 *               value:
 *                 value: 70
 *                 unit: "kg"
 *             pounds:
 *               summary: Weight in pounds
 *               value:
 *                 value: 154
 *                 unit: "lb"
 *         fitnessGoal:
 *           type: string
 *           enum: ["Lose Weight", "Gain Muscle", "Improve Endurance", "Maintain Weight", "Increase Flexibility", "Build Strength", "General Fitness"]
 *           example: "Gain Muscle"
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 25
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 25
 *           example: "Doe"
 *         fitnessLevel:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *           example: "Intermediate"
 *         workoutFrequency:
 *           type: string
 *           enum: ["1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"]
 *           example: "3-4 times per week"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User registered successfully"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 age:
 *                   type: integer
 *                   example: 25
 *                 gender:
 *                   type: string
 *                   example: "Male"
 *                 height:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: number
 *                       example: 175
 *                     unit:
 *                       type: string
 *                       example: "cm"
 *                     inches:
 *                       type: number
 *                       example: 0
 *                 weight:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: number
 *                       example: 70
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                 fitnessGoal:
 *                   type: string
 *                   example: "Gain Muscle"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *             token:
 *               type: string
 *               description: "JWT authentication token"
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         statusCode:
 *           type: integer
 *           example: 400
 *         validationErrors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 example: "height"
 *               message:
 *                 type: string
 *                 example: "Invalid height: cm should be 50-300, ft should be 1-9 feet with 0-11 inches"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Enter JWT token in format: Bearer <token>"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user for fitness app
 *     description: |
 *       Register a new user with comprehensive fitness profile information.
 *
 *       **Height Guidelines:**
 *       - For cm: value should be between 50-300, inches must be 0
 *       - For ft: value should be between 1-9 feet, inches can be 0-11
 *
 *       **Examples:**
 *       - 175cm: `{"value": 175, "unit": "cm", "inches": 0}`
 *       - 5'9": `{"value": 5, "unit": "ft", "inches": 9}`
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             metric_user:
 *               summary: User with metric measurements
 *               value:
 *                 email: "jane.smith@example.com"
 *                 password: "securepass123"
 *                 fullName: "Jane Smith"
 *                 age: 28
 *                 gender: "Female"
 *                 height:
 *                   unit: "cm"
 *                   cm: 165
 *                 weight:
 *                   value: 60
 *                   unit: "kg"
 *                 fitnessGoal: "Lose Weight"
 *                 firstName: "Jane"
 *                 lastName: "Smith"
 *                 fitnessLevel: "Beginner"
 *                 workoutFrequency: "3-4 times per week"
 *             imperial_user:
 *               summary: User with imperial measurements
 *               value:
 *                 email: "john.doe@example.com"
 *                 password: "password123"
 *                 fullName: "John Doe"
 *                 age: 25
 *                 gender: "Male"
 *                 height:
 *                   unit: "ft"
 *                   feet: 5
 *                   inches: 9
 *                 weight:
 *                   value: 154
 *                   unit: "lb"
 *                 fitnessGoal: "Gain Muscle"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               height_validation_error:
 *                 summary: Height validation error
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   statusCode: 400
 *                   validationErrors:
 *                     - path: "height"
 *                       message: "Invalid height: cm should be 50-300, ft should be 1-9 feet with 0-11 inches"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
