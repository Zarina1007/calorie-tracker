const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load environment variables from .env file
dotenv.config();

const userRoutes = require('./routes/users');
const calorieRoutes = require('./routes/calories');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('👓  MongoDB Connected'))
    .catch(err => console.log(err.message));

app.use(bodyParser.json({ limit: '50mb', extended: true }));

// Enable Express to parse JSON bodies in requests
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/', calorieRoutes);

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Calories Manager Restful Web Services',
            version: '1.0.0',
            description: 'API Documentation for Calorie Service'
        },
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Calorie Server running on port ${PORT}`);
});
