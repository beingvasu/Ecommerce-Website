// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { validateProduct , isLoggedIn } = require('../middleware')


// Registration form
router.get('/register', (req, res) => {
  res.render('auth/signup');
});

// Register user
router.post('/register', async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const user = new User({ email, username, role });

  try {
    // Register user using passport-local-mongoose
    let newUser = await User.register(user, password);

    req.login(newUser, (err) => {
      if (err) return next(err);
      res.redirect('/products');  // Redirect to home page after login
    });

  } catch (err) {
    next(err); // Pass other errors to the default error handler
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login user
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password!'
  }),
  (req, res) => {
    console.log('User details:', req.user);  // Log entire user object
    console.log('User role:', req.user.role);  // Specifically log the role
    res.redirect('/products');
  }
);

// Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);  // You may want to handle any errors during logout
    }
    res.redirect('/login');
  });
});

module.exports = router;