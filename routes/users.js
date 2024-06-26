const express = require('express');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 first_name:
 *                   type: string
 *                   example: John
 *                 last_name:
 *                   type: string
 *                   example: Doe
 *                 birthday:
 *                   type: string
 *                   example: January 01, 1990
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id }).select('-_id -__v');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
