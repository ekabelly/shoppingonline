const User = require('../db/models/user.model');
const {errorHandler, fetchDataWithFields, successHadler} = require('../db/mongo');

const passportAuthentication = (req, res, next)=>{
	if(!req.isAuthenticated()){
		return res.send(401);
	}
	next()
};

const fetchAllUsers = (req,res,next) => fetchDataWithFields(User, {}, 'email pass', (err,data) => errorHandler(res,err,() => successHadler(req,data,next)));

const validateDouble = (req,res,next) =>fetchDataWithFields(User, {}, 'email', ()=>findDouble('email', res, req, data, next)));

const findDouble = (field, res, req, data, next) => data.find(x=>req.body[field] === x[field]) ? res.json({status:'failed', messege:field+' already exists'}) : next() ;

const createUser = (req, res, next) =>{
	req.user = new User(req.body);
	req.user.save((err, data2)=> err ? res.json(err) : successHadler(req, data2, next));
}

const validateLogin = (email, pass) => fetchDataWithFields(User, {email:email, pass: pass}, 'email pass', (data, err) =>{return data !== [] ? true : false});

// const findLogin = (data, email, pass) => data.find(x=>x.email === email && x.pass === pass);

module.exports = {createUser, fetchAllUsers, validateDouble, validateLogin, passportAuthentication}