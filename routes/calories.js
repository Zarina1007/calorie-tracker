const express = require('express');
const Calorie = require('../models/Calorie');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * /addcalories:
 *   post:
 *     summary: Add a new calorie entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: User ID who is logging the calories
 *                 example: 1
 *               year:
 *                 type: integer
 *                 description: Year of the calorie entry
 *                 example: 2024
 *               month:
 *                 type: integer
 *                 description: Month of the calorie entry
 *                 example: 5
 *               day:
 *                 type: integer
 *                 description: Day of the calorie entry
 *                 example: 5
 *               description:
 *                 type: string
 *                 description: Description of the calorie entry
 *                 example: "Lunch at restaurant"
 *               category:
 *                 type: string
 *                 description: Category of the calorie entry (e.g., food, exercise)
 *                 example: "breakfast"
 *               amount:
 *                 type: number
 *                 description: Amount of calories
 *                 example: 650
 *     responses:
 *       200:
 *         description: The created calorie entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: User ID of the entry
 *                 year:
 *                   type: integer
 *                   description: Year of the entry
 *                 month:
 *                   type: integer
 *                   description: Month of the entry
 *                 day:
 *                   type: integer
 *                   description: Day of the entry
 *                 description:
 *                   type: string
 *                   description: Description of the entry
 *                 category:
 *                   type: string
 *                   description: Category of the entry
 *                 amount:
 *                   type: number
 *                   description: Amount of calories
 *       500:
 *         description: Server error
 */
router.post('/addcalories', async (req, res) => {
    const { user_id, year, month, day, description, category, amount } = req.body;

    try {
        // Check if the user exists
        const userExists = await User.findOne({ id: user_id });
        if (!userExists) {
            return res.status(400).json({ error: "User not found." });
        }
        const newCalorie = new Calorie({
            user_id,
            year,
            month,
            day,
            description,
            category,
            amount
        });
        const savedCalorie = await newCalorie.save();
        const responseCalorie = await Calorie.findById(savedCalorie._id).select('-__v -_id -id');
        res.send(responseCalorie);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Get calorie report by month, year, and user_id
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID of the person for whom the report is being generated
 *         example: 1
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Year of the report
 *         example: 2024
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Month of the report
 *         example: 5
 *     responses:
 *       200:
 *         description: A report object containing calorie entries categorized by breakfast, lunch, dinner, and other.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 breakfast:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *                 lunch:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *                 dinner:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *                 other:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get('/report/', async (req, res) => {
    const { user_id, year, month } = req.query;

    try {
        const categories = ['breakfast', 'lunch', 'dinner', 'other'];
        let report = {};

        for (let category of categories) {
            report[category] = await Calorie.find({ user_id, year, month, category }).select('day description amount -_id');
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Retrieve a list of developers
 *     responses:
 *       200:
 *         description: A list of developers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     example: "dave"
 *                   lastname:
 *                     type: string
 *                     example: "cohen"
 *                   id:
 *                     type: integer
 *                     example: 234234
 *                   email:
 *                     type: string
 *                     example: "daddd@gmail.com"
 *       500:
 *         description: Server error
 */
router.get('/about', (req, res) => {
    const developers = [
        { "firstname": "dave", "lastname": "cohen", "id": 234234, "email": "daddd@gmail.com" },
        { "firstname": "tal", "lastname": "levy", "id": 34534544, "email": "tal@gmail.com" }
    ];
    res.send(developers);
});

module.exports = router;
