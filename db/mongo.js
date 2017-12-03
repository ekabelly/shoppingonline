const mongoose = require('mongoose');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const POPULATE_FIELD = 'products';

const createSuccessResponse = data => ({data, success: true});
const responseMiddleware = (req, res) => res.json(createSuccessResponse(req.data));

const errorHandler = (err,res,cb) => err ? res.json(err) : cb();

const successHandler = (req, data, next) => {
	req.data = data;
	return next();
}

const saveNewItem = (req, res, next) => req.new.save((err, data)=>errorHandler(err, res, ()=>successHandler(req, data, next)));

const createCategory = (req, res, next) =>{
	req.new = new Category(req.body);
	saveNewItem(req, res, next);
}

const createProduct = (req, res, next) =>{
	req.new = new Product(req.body);
	req.new.save((err, product)=>errorHandler(err, res, ()=>successHandler(req, product, ()=>Category.findOne({_id:req.body.categoryId}).then(category=>{
		category.products.push(product);
		category.save((err, updateData) => errorHandler(err, res, () => successHandler(req, {product, updateData}, next)));
	}))));
}

const createOrder = (req, res, next) =>{
	req.new = new Order(req.body);
	saveNewItem(req, res, next);
}


const updateProduct = (req, res, next) => Product.update({_id:req.params.id}, req.body, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));

const fetchProductsByCategory = (req, res, next) =>Category.findOne({_id:req.params.id}).populate({path:'product.', model:Product}).exec((err, data)=>errorHandler(err, res, () => successHandler(req, data.products, next)));

const fetchProducts = (req, res, next) =>{
	const find = req.body.products ? { _id: {$in: req.body ? req.body.products : ''}} : {};
	return Product.find(find).exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
} 

const fetchOrders = (req, res, next) =>Order.find({}).exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));

module.exports = {createCategory, createProduct, updateProduct, createOrder,fetchProducts, fetchOrders, fetchProductsByCategory, responseMiddleware}

