import express from "express";
import {
    getCategories,
    getCategoriesById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategory
} from '../controllers/categoryController.js';

import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware.js";

const router = express.Router();

router.get('/categories/search', searchCategory);
router.get('/categories/', getCategories);
router.get('/categories/:id', getCategoriesById);
router.post('/categories', authMiddleware, isAdmin, createCategory);
router.put('/categories/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/categories/:id', authMiddleware, isAdmin, deleteCategory);

export default router;
