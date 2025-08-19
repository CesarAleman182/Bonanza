import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
        trim: true,
    },
    Description: {
        type:String,
        required: true,
        trim: true,
    },
    Price: {
        type: Number,
        required: true,
        min: 1,
    },
    ImagesUrl: [{
        type: String,
        default: 'https://placehold.co/200x200.png',
        trim: true,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    available:{
        type: Boolean,
        default:true,
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;