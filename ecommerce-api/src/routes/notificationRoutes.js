import express from "express";
import {
    getNotifications,
    getNotificationById,
    getNotificationByUser,
    createNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsReadByUser,
    getUnreadNotificationsByUser,
} from '../controllers/notificationController.js'

import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware.js";

const router = express.Router();

router.get('/notifications', authMiddleware, isAdmin, getNotifications);
router.get('/notifications/unread/:userId', authMiddleware, isAdmin, getUnreadNotificationsByUser);
router.get('/notifications/user/:userId', authMiddleware, isAdmin, getNotificationByUser);
router.get('/notifications/:id', authMiddleware, isAdmin, getNotificationById);
router.post('/notifications', authMiddleware, createNotification);
router.patch('/notifications/:id/mark-read', authMiddleware, markAsRead);
router.patch('/notifications/user/:userId/mark-all-read', authMiddleware, markAllAsReadByUser);
router.put('/notifications/:id', authMiddleware, isAdmin, updateNotification);
router.delete('/notifications/:id', authMiddleware, isAdmin, deleteNotification);

export default router;