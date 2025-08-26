import express from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validation.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
    body('name')
        .notEmpty().withMessage('Name is required')
        .length({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9 ]*$/).withMessage('Name must be letter, numbers and spaces'),

    body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),

    body('phone')
    .notEmpty().withMessage('phone is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone must be exactly 10 digits')
    .isNumeric().withMessage('Phone must contain only numbers'),

    body('role')
    .optional()
    .isIn(['admin', 'customer']).withMessage('Role must be admin, customer'),
], validate, register);

router.post('/login', [
    body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('password is required')
],validate, login);

export default router;