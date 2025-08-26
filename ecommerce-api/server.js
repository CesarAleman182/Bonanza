import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/config/database.js';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middleware/logger.js';
import setupGlobalErrorHandler from './src/middleware/globalErrorHandler.js'
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

setupGlobalErrorHandler();

const app = express();
dbConnection();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('WELCOME!');
});

app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.originalUrl,
    });
});

app.use(errorHandler);

    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });