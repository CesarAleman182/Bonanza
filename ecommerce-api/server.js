import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/config/database.js';

dotenv.config();

const app = express();
dbConnection();

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});