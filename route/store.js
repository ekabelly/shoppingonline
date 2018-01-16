const express = require('express');
const Router = express.Router();
const {
	createCategory,
	createProduct,
	createInvoice,
	updateProduct,
	createOrder,
	fetchProducts,
	fetchCategories,
	fetchOrders,
	updateOrder
} = require('../db/mongo');

const {checkCreditCard, validateFinalPrice, responseMiddleware} = require('../services');

	Router.get('/categories', fetchCategories, responseMiddleware);

	Router.put('/order', fetchProducts, validateFinalPrice, createOrder, responseMiddleware);

	Router.patch('/:id/order', fetchProducts, validateFinalPrice, checkCreditCard, updateOrder, responseMiddleware);

	Router.get('/:id/order', fetchOrders, responseMiddleware);

	Router.get('/:id/invoice', fetchOrders, createInvoice);

	module.exports = Router;