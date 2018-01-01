const express = require('express');
const Router = express.Router();
const {createCategory, createProduct, updateProduct, createOrder, fetchProductsByCategory, responseMiddleware, fetchProducts, fetchCategories, fetchOrders, updateOrder} = require('../db/mongo');

Router.post('/products', fetchProducts, responseMiddleware);

Router.get('/categories', fetchCategories, responseMiddleware);

Router.put('/order', createOrder, responseMiddleware);

Router.patch('/:id/order', updateOrder, responseMiddleware);

Router.get('/:id/products', fetchProductsByCategory, responseMiddleware);

Router.get('/:id/order', fetchOrders, responseMiddleware);

module.exports = Router;