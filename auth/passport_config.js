const User = require('../db/models/user.model');
const crypto = require('crypto');
const {secret} = require('./config');

const passportHandlers = {
  passToCrypto:pass=>crypto.createHmac('sha256', secret).update(pass).digest('hex'),
  signup: (req, email, pass, done) => {
    //req.body contains all form fields from the signup form
    req.body.email = email;
    req.body.pass = passportHandlers.passToCrypto(pass);
    const user = new User(req.body);
    user.save((err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  },
  login: (email, pass, done) => {
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'User not found'});
      }
      if (user.pass !== passportHandlers.passToCrypto(pass)) {
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
  },
  validateAdmin: (req, res, next) => {
    User.findOne({email:req.user.email}, (err, user) => {
      if (err) {
        return res.json(err);
      } 
      if (!user) {
        return res.json({message: 'User not found'});
      }
      if (user.role === 'admin') {
        return next();
      }
      return res.sendStatus(401);
    }); 
  }
}

module.exports = passportHandlers;