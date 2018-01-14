const express = require('express');
const Router = express.Router();
const {
	createCategory,
	createProduct,
	createInvoice,
	updateProduct,
	createOrder,
	fetchProductsByCategory,
	fetchProducts,
	fetchCategories,
	fetchOrders,
	updateOrder
} = require('../db/mongo');
const {checkCreditCard, validateFinalPrice, bookedDates, responseMiddleware} = require('../services');

	Router.post('/products', fetchProducts, responseMiddleware);

	Router.get('/categories', fetchCategories, responseMiddleware);

	Router.put('/order', fetchProducts, validateFinalPrice, createOrder, responseMiddleware);

	Router.patch('/:id/order', fetchProducts, validateFinalPrice, checkCreditCard, updateOrder, responseMiddleware);

	Router.get('/:id/products', fetchProductsByCategory, responseMiddleware);

	Router.get('/:id/order', fetchOrders, responseMiddleware);

	Router.get('/:id/invoice', fetchOrders, createInvoice, responseMiddleware);

	Router.post('/dates', fetchOrders, bookedDates);

	module.exports = Router;