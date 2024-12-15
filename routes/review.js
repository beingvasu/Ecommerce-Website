
const express = require('express')
const router = express.Router() // mini server
const Review = require('../models/Review')
const Product = require('../models/Product')
const { validateReview } = require('../middleware')


router.post('/product/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        // Validate input
        if (!comment || !rating) {
            req.flash('error', 'Rating and comment are required.');
            return res.redirect(`/product/${id}`);
        }

        const ratingNumber = parseInt(rating, 10); // Ensure rating is a number
        if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            req.flash('error', 'Rating must be a number between 1 and 5.');
            return res.redirect(`/product/${id}`);
        }

        // Check if the user is logged in
        if (!req.user) {
            req.flash('error', 'You must be logged in to add a review.');
            return res.redirect(`/product/${id}`);
        }

        // Create a new review
        const review = new Review({
            comment,
            rating: ratingNumber,
            product: id,
            user: req.user._id, // User's ID is assigned here
        });

        await review.save();

        const product = await Product.findById(id);
        if (!product) {
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }

        product.reviews.push(review);
        await product.save();

        req.flash('success', 'Review added successfully!');
        res.redirect(`/product/${id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred.');
        res.redirect(`/product/${id}`);
    }
});




module.exports = router;
