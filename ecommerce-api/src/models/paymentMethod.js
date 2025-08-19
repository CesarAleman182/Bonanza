import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['credit card', 'debit card', 'bank transfer', 'cash on delivery']
    },
    //Para tarjetas
    cardNumber: {
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    cardHolderName: {
        type: String,
        trim: true,
        minlength: 2,
    },
    expiryDate: {
        type: String,
        match: '/^(0[1-9]|1[0-2])\/\d{2}$/',
    },
    // Para transferencia bancaria
    bankName: {
        type: String,
        trim: true,
        minlenght: 2,
    },
    accountNumber: {
        type: String,
        match: '/^\d{10,18}$/',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;