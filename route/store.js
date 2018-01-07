const express = require('express');
const Router = express.Router();
const {createCategory, createProduct, createInvoice, updateProduct, createOrder, fetchProductsByCategory, responseMiddleware, fetchProducts, fetchCategories, fetchOrders, updateOrder} = require('../db/mongo');

Router.post('/products', fetchProducts, responseMiddleware);

Router.get('/categories', fetchCategories, responseMiddleware);

Router.put('/order', createOrder, responseMiddleware);

Router.patch('/:id/order', updateOrder, responseMiddleware);

Router.get('/:id/products', fetchProductsByCategory, responseMiddleware);

Router.get('/:id/order', fetchOrders, responseMiddleware);

Router.get('/:id/invoice', fetchOrders, createInvoice, responseMiddleware);

module.exports = Router;