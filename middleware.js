const { productSchema, reviewSchema } = require('./schema');
const Product = require('./models/Product');

const validateProduct = async (req, res, next) => {
    console.log(req.body);
    
    const { name, img, price, desc } = req.body;
    const { error } = productSchema.validate({ name, img, price, desc }); // Joi validation

    if (error) {
        return res.redirect('products')
    }
    
    next();
};

const validateReview = (req, res, next) => {
    let { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment }); // Joi validation

    if (error) {
        return res.redirect(`/product/${id}`)
    }
    next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

const isSeller = (req, res, next) => {
    console.log('isSeller Middleware - User:', req.user);
    if (!req.user) {
        return res.redirect('/login');
    }
    if (req.user.role !== 'seller') {
        return res.redirect('/products');
    }
    next();
};

const isProductAuthor = async (req, res, next) => {
    const { id } = req.params; // product ID
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.redirect('/products');
        }
        if (!product.author.equals(req.user._id)) {
            return res.redirect('/products');
        }
        next(); // Allow the request to proceed
    } catch (error) {
        return res.redirect('/products');
        
    }
};

module.exports = { validateProduct, validateReview, isLoggedIn, isSeller, isProductAuthor };