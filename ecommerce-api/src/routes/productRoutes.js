import express from "express";

import {
    getProducts,
    getProductById,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
} from '../controllers/productController.js';

import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware";
import validate from "../middleware/validation.js";
import { query } from 'express-validator';

const router = express.Router();

router.get('/products', [
    query('page')
    .optional()
    .isNumeric()
    .withMessage('Page must be a number'),
    query('limit')
    .optional()
    .isNumeric().withMessage('Limit must be a number'),
], validate, getProducts);

router.get('/products/:id/search',searchProducts );
router.get('/products/category/:idCategory', getProductByCategory);
router.get('/products/:id', getProductById);
router.post('/products', authMiddleware, isAdmin, createProduct);
router.put('/products/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/products/:id', authMiddleware, isAdmin, deleteProduct);

export default router;