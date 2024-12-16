require('dotenv').config();
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const User = require('./models/User');

// Passport strategy setup
const LocalStrategy = require('passport-local').Strategy;

// Passport initialization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommProject')
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

// App initialization
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// EJS setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash setup
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(flash());

// Pass flash messages to all views

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;  // Explicitly set to null if no user
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
// Static files

// Routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');


app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

// Start server
const portNum = process.env.PORT || 8080;
app.listen(portNum, () => {
  console.log(`Server running on port ${portNum}`);
});