const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy()); //login to passport

//on each request, we pass along the 'User' object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());