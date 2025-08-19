import { type } from "express/lib/response";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    types: {
        type: String,
        enum: ['order_update', 'reminder', 'system'],
        default: 'system',
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default:Date.now,
    },
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;