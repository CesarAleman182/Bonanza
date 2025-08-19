import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            products: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        }
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;