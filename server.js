const session = require('express-session');
const CP = require('cookie-parser');
const BP = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passportConfig = require('./auth/passport_config');
const Route = require('./route/store');
const AdminRoute = require('./route/admin');
const {uploadFile} = require('./services');

const {
	dburl, 
	secret, 
	cookieName, 
	userResponse
} = require('./auth/config');

const {
	fetchProducts, 
	fetchOrders, 
	responseMiddleware, 
	fetchUserOrders
} = require('./db/mongo');

const startServer = () => app.listen(4001, ()=>console.log('server up on port 4001'));

passport.use('local', new LocalStrategy(passportConfig.login));
passport.use('local-sign', new LocalStrategy({passReqToCallback: true}, passportConfig.signup));
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);

app.use(fileUpload());
app.use(BP.json());
app.use(BP.urlencoded({extended:true}));
app.use(CP());
app.use(session({
	store: new MongoStore({
		url: dburl
	}),
	secret:secret,
	name:cookieName,
	resave:false,
	saveUninitialized:false,
	cookie:{
		httponly:false,
		maxAge:1000*60*60,
		secure:false
	}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/login', express.static('public'));

app.post('/login', passport.authenticate('local'), fetchUserOrders, userResponse);

app.post('/signup', passport.authenticate('local-sign'), (req, res)=>res.json({success:true, user:{_id:req.user._id, fName:req.user.fName, lName:req.user.fName, role:req.user.role}}));

app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/login');
});

app.get('/products', fetchProducts, responseMiddleware);

app.get('/orders', fetchOrders, responseMiddleware);

app.all('*', passportConfig.validatedUser);

app.get('/user', fetchUserOrders, userResponse);

app.use('/store', express.static('client'));

app.use('/store', Route);

app.all('*', passportConfig.validateAdmin);

app.use('/admin', express.static('admin'));

app.use('/admin', AdminRoute);

app.post('/admin/image', uploadFile);

mongoose.connect(dburl, {useMongoClient: true}, err=>err ? console.log(err) : startServer());