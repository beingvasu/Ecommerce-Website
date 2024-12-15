const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        trim: true
    },
    img: {
        type: String,
        required: [true, 'Image URL is required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be a non-negative number.']
    },
    desc: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

// Middleware to clean up reviews after a product is deleted
productSchema.post('findOneAndDelete', async function (product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;