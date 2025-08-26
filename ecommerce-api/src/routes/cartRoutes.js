import express from 'express';

import {
    getCarts,
    getCartById,
    getCartByUser,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
} from '../controllers/cartController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';

const router = express.Router();

router.get('/cart', authMiddleware, isAdmin,getCarts);
router.get('/cart/:id', authMiddleware, isAdmin,getCartById);
router.get('/cart/user/:userId', authMiddleware, isAdmin, getCartByUser);
router.post('/cart', authMiddleware, createCart);
router.post('/cart/add-product', authMiddleware, addProductToCart);
router.put('/cart/:id', authMiddleware, updateCart);
router.delete('/cart/:id', authMiddleware, deleteCart);

export default router;