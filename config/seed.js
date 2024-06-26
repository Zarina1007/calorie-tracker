const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('👓  MongoDB Connected'))
    .catch(err => console.log(err.message));

// Seed function
async function seed() {
    try {
        await User.deleteMany(); // Make sure to clear existing users if needed

        const userData = [
            {
                first_name: 'moshe',
                last_name: 'israeli',
                birthday: new Date('1990-01-10')
            },
            {
                first_name: 'john',
                last_name: 'doe',
                birthday: new Date('1985-02-20')
            }
        ];

        for (let user of userData) {
            await new User(user).save();
        }

        console.log('Initial users created');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the seed function
seed();
