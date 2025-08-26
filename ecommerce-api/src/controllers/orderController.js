import Order from '../models/order.js';
import errorHandler from '../middleware/errorHandler.js';

async function getOrders(req, res, next) {
    try {
        const orders = await Order.find().populate('user').populate('products.productId').populate('paymentMethod').sort({ status: 1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

async function getOrderById(req, res, next) {
    try {
        const id = req.params.id;
        const order = await Order.findById(id).populate('user')
            .populate('products.productId')
            .populate('paymentMethod');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
}

async function getOrdersByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId }).populate('user')
            .populate('products.productId')
            .populate('paymentMethod')
            .sort({ status: 1 });
        if (orders.length === 0) {
            return res.json(404).json({ message: 'No orders found for this user' });
        }
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

async function createOrder(req, res, next) {
    try {
        const { user, products, paymentMethod } = (req.body);
        if (!user || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'User and products array are required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ error: 'PaymentMethod array is required' });
        }

        for (const item of products) {
            if (!item.productId || !item.quantity || !item.price || item.quantity < 1) {
                return res.status(400).json({ error: 'Each product must have a valid productId, quantity, and price' });
            }
        }

        const totalPrice = products.reduce((total, item) => total + (item.price * item.quantity), 0);

        const newOrder = await Order.create({
            user,
            products,
            paymentMethod,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await newOrder.populate('user');
        await newOrder.populate('products.productId');
        await newOrder.populate('paymentMethod');
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const allowedFields = ['status', 'paymentStatus'];
        const filteredUpdate = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredUpdate[field] = updateData[field];
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, filteredUpdate, { new: true }
        )
            .populate('user')
            .populate('products.productId')
            .populate('paymenMethod');

        if (updatedOrder) {
            return res.status(200).json(updatedOrder);
        } else {
            return res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        next(error);
    }
}

async function cancelOrder(req, res, next) {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.stauts(404).json({ message: 'Order not found' });
        }

        // if(order.status === 'cancelled'){
        //     return res.status(400).json({message: 'Cannot cancel a order with status' + order.status})
        // }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                status: 'cancelled',
                paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'cancelled'
            },
            { new: true }
        )
            .populate('user')
            .populate('products.productId')
            .populate('paymentMethod');

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
}

async function updateOrderStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('user')
            .populate('products.productId')
            .populate('paymentMethod');

        if (updatedOrder) {
            return res.status(200).json(updatedOrder);
        } else {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
}

async function updatePaymentStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                error: 'Invalid payment status. Valid statuses: ' + validPaymentStatuses.join(', ')
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        )
            .populate('user')
            .populate('products.productId')
            .populate('paymentMethod');

        if (updatedOrder) {
            return res.status(200).json(updatedOrder);
        } else {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
}

async function deleteOrder(req, res) {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.status !== 'cancelled') {
            return res.status(400).json({
                message: 'Only cancelled orders can be deleted'
            });
        }

        await Order.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error });
    }
}

export {
    getOrders,
    getOrderById,
    getOrdersByUser,
    createOrder,
    updateOrder,
    cancelOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
}