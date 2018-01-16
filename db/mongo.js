const mongoose = require('mongoose');
const fs = require('fs');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const POPULATE_FIELD = 'products';

//-----------general functions

const errorHandler = (err,res,cb) => {
	if (err) res.json(err);
	if (cb) cb();
}

const successHandler = (req, data, next) => {
	req.data = data;
	return next();
}

const saveNewItem = (req, res, next) => req.new.save((err, data)=>errorHandler(err, res, ()=>successHandler(req, data, next)));

//-----------categories functions

const createCategory = (req, res, next) =>{
	req.new = new Category(req.body);
	saveNewItem(req, res, next);
}

const fetchCategories = (req, res, next) => Category.find({}).populate({path:POPULATE_FIELD, model:Product}).exec((err, data)=>errorHandler(err, res, () => successHandler(req, data, next)));

//-----------products functions

const createProduct = (req, res, next) =>{
	req.new = new Product(req.body);
	req.new.save((err, product)=>errorHandler(err, res, ()=>successHandler(req, product, ()=>Category.findOne({_id:req.body.categoryId}).then(category=>{
		category.products.push(product);
		category.save((err, updateData) => errorHandler(err, res, () => successHandler(req, {product, updateData}, next)));
	}))));
}

const updateProduct = (req, res, next) => Product.update({_id:req.params.id}, req.body, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));

const fetchProducts = (req, res, next) =>{
	const find = req.body.products ? { _id: {$in: req.body ? req.body.products : ''}} : {};
	return Product.find(find).exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}
//-----------orders functions

const createOrder = (req, res, next) =>{
	req.new = new Order(req.body);
	saveNewItem(req, res, next);
}

const updateOrder = (req, res, next) => Order.update({_id:req.params.id}, req.body, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));

const fetchOrders = (req, res, next) =>{
	const find = {};
	const request = {street:false, lastDigits:false};
	if (req.params.id) {
		find = {_id:req.params.id};
	}
	Order.find(find, request).populate({path:POPULATE_FIELD, model:Product}).exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}

const fetchUserOrders = (req, res, next) =>Order.find({userId: req.user._id}).populate({path:POPULATE_FIELD, model:Product}).exec((err, data) => errorHandler(err, res, () =>successHandler(req, data, next)));

const createInvoice = (req, res, next) =>fs.writeFile('invoices/'+req.params.id+'.txt', req.data, err=>errorHandler(err, res, ()=>res.download('invoices/'+req.params.id+'.txt')));

module.exports = {
	createCategory, 
	createProduct, 
	createInvoice, 
	updateProduct, 
	createOrder, 
	updateOrder, 
	fetchProducts, 
	fetchOrders, 
	fetchCategories, 
	fetchOrders, 
	fetchUserOrders
}