const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

// route to see the cart
router.get('/user/cart', isLoggedIn, async (req, res) => {
    try {
        let user = await User.findById(req.user._id).populate('cart');
        res.render('cart/cart', { user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Actually adding the product to the cart
router.post('/user/:productId/add', isLoggedIn, async (req, res) => {
    try {
        let { productId } = req.params;
        let userId = req.user._id;
        let product = await Product.findById(productId);
        let user = await User.findById(userId);

        // Check if the product is already in the cart
        if (!user.cart.includes(productId)) {
            user.cart.push(product);
            await user.save();
        }

        res.redirect('/user/cart'); // Redirect to the cart page after adding
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get('/checkout' ,isLoggedIn, (req , res)=>{
    res.send('PAGE UNDER MAINTAINCE <a href="/products">Go Back</a>');
})

module.exports = router;