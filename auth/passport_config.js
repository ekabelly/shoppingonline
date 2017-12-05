const User = require('../db/models/user.model');

const mongoose = require('mongoose');

const passportHandlers = {
  signup: (req, email, pass, done) => {
    //req.body contains all form fields from the signup form
    req.body.email = email;
    req.body.pass = pass;
    const user = new User(req.body);
    user.save((err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  },
  login: (email, pass, done) => {
  	// console.log(email, pass, done);
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'User not found'});
      }
      if (user.pass !== pass) {
        return done(null, false, {message: 'Incorrect pass'});
      }
      return done(null, user);
    });
  },
  serializeUser: (user, done) => done(null, user),
  deserializeUser: (user, done) => done(null, user),
  validatedUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.sendStatus(401);
  }
}

module.exports = passportHandlers;