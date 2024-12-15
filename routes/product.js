
const express = require('express')
const router = express.Router() // mini server

// importing product schema
const Product = require('../models/Product')
const Review = require('../models/Review')

const { validateProduct , isLoggedIn, isSeller, isProductAuthor } = require('../middleware')

router.get('/' , (req , res)=>{
    res.redirect('/products')
})

router.get('/products', isLoggedIn, async (req, res) => {
    try {
        // Fetch the products from the database
        let Products = await Product.find({});

        // Pass Products to the view along with any flash messages
        res.render('products/products', {
            Products: Products, // Ensure the products are passed here
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (err) {
        res.status(404).render('products/error', { err });
    }
});

// form of new product
// In product.js routes
router.get('/product/new', isLoggedIn, isSeller, (req, res) => {
    console.log('New Product Route - User:', req.user);
    res.render('./products/addProduct.ejs');
});

// to actually add the product
router.post('/products', isLoggedIn, isSeller, validateProduct, async (req, res) => {
    try {
        let { name, img, price, desc } = req.body;
        let createdProduct = await Product.create({ name, img, price, desc, author: req.user._id });
        
        // Flash message for successful creation
        // req.flash('success', 'Product created successfully!');
        res.redirect('/products'); // Redirect to products page after creation
    } catch (err) {
        req.flash('error', 'Error creating product');
        res.status(500).redirect('/products/new'); // Redirect to product creation page in case of error
    }
});



// to show a particular product
router.get('/product/:id',isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const selectedProduct = await Product.findById(id).populate('reviews');

        // Pass the flash messages as 'msg' and 'success' to the view
        res.render('products/show', {
            selectedProduct,
            msg: req.flash('msg'), // flash message
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (err) {
        res.status(404).render('products/error', { err });
    }
});

// edit
router.get('/product/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const selectedProduct = await Product.findById(id);
        res.render('products/edit', { selectedProduct, msg: req.flash('success') });
    } catch (err) {
        res.status(404).render('products/error', { err });
    }
});

// to update data in db which has been edited
router.patch('/product/:id', isLoggedIn, validateProduct, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, img, price, desc } = req.body;

        // Update the product with the new details
        await Product.findByIdAndUpdate(id, { name, img, price, desc });

        // Flash a success message when product is updated
        req.flash('success', 'Product updated successfully!');
        res.redirect(`/product/${id}`);
    } catch (err) {
        req.flash('error', 'There was an error updating the product.');
        res.redirect(`/product/${id}/edit`);
    }
});



// delete
router.delete('/product/:id' ,isLoggedIn, isProductAuthor, async (req , res)=>{
    try{
        let {id} = req.params;
        let product = await Product.findById(id)
    
        // for (let id of product.reviews) {   
        //     await Review.findByIdAndDelete(id)
        // } // sasta method
        await Product.findByIdAndDelete(id)
        res.redirect('/products')
    }

    catch(err){
        res.status(404).render('/products/error' , err)
    }
})


module.exports = router;



