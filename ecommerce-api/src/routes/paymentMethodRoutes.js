import express from "express";

import {
    getPaymentMethods,
    getPaymentMethodById,
    getPaymentMethodsByUser,
    createPaymentMethod,
    updatePaymentMethod,
    setDefaultPaymentMethod,
    deactivatePaymentMethod,
    deletePaymentMethod,
    getDefaultPaymentMethod
} from '../controllers/paymentMethodController.js';

import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware";

const router = express.Router();

router.get('/payment-methods', authMiddleware, isAdmin, getPaymentMethods);

router.get('/payment-methods/default/:userId', authMiddleware, getDefaultPaymentMethod);

router.get('/payment-methods/user/:userId', authMiddleware, getPaymentMethodsByUser);

router.get('/payment-methods/:id', authMiddleware, getPaymentMethodById);

router.post('/payment-methods', authMiddleware, createPaymentMethod);

router.patch('/payment-methods/:id/set-default', authMiddleware, setDefaultPaymentMethod);

router.patch('/payment-methods/:id/deactivate', authMiddleware, deactivatePaymentMethod);

router.put('/payment-methods/:id', authMiddleware, updatePaymentMethod);

router.delete('/payment-methods/:id', authMiddleware, deletePaymentMethod);

export default router;