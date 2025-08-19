import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    group: {
        type: String,
        enu: ['comida', 'bebidas'],
        required: true,
    },
    description: {
        type: String,
        requiered: true,
        tirm: true,
    },
    imageURL: {
        type: String,
        trim: true,
        default: 'https://placehold.co/800x600.png',
    },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;