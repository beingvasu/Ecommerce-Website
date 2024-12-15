const { productSchema, reviewSchema } = require('./schema');
const Product = require('./models/Product');

const validateProduct = async (req, res, next) => {
    console.log(req.body);
    
    const { name, img, price, desc } = req.body;
    const { error } = productSchema.validate({ name, img, price, desc }); // Joi validation

    if (error) {
        res.status(400).json({ 
            message: 'Validation error', 
            details: error.details.map(detail => detail.message)
        })
        return setTimeout(() => {
            res.redirect('/products');
        }, 1000);

    
    }
    
    next();
};

const validateReview = (req, res, next) => {
    let { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment }); // Joi validation

    if (error) {
        res.status(400).send(`
            <p>Validation error: ${error.details[0].message}</p>
            <p>Redirecting to <a href="/products">Products</a> in 1 second...</p>
        `);

        setTimeout(() => {
            res.redirect('/products');
        }, 1000);

        return;
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
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!product.author.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        next(); // Allow the request to proceed
    } catch (error) {
        console.error('Error in isProductAuthor:', error);
        res.status(500).json({ message: 'Server error' });
        setTimeout(() => {
            res.redirect('/products');
        }, 1000);
        return
    }
};

module.exports = { validateProduct, validateReview, isLoggedIn, isSeller, isProductAuthor };