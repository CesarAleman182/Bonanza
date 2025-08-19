import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    hashPassword: {
        type:String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        max: 10,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'customer'],
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const User = mongoose.model('User', userSchema);

export default User;