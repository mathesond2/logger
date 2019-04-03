const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; // couple of way to wait for data to come back..here we're using async/await, so we'll use es6 promises for mongoose
// const slugs = require('slugs');

// const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

//do data normalization as close to the model as possible
const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please add your email address',
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler); //for much nicer error msgs

// userSchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     next();
//     return;
//   };
//   this.slug = slug(this.name);
//   next();
// });

module.exports = mongoose.model('User', userSchema); 