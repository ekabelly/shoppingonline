const express = require('express');
const Router = express.Router();
const {
	createCategory, 
	createProduct, 
	updateProduct
} = require('../db/mongo');
const {responseMiddleware} = require('../services');

Router.put('/category', createCategory, responseMiddleware);

Router.put('/product', createProduct, responseMiddleware);

Router.patch('/:id/product', updateProduct, responseMiddleware);

module.exports = Router;