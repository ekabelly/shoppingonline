const express = require('express');
const Router = express.Router();
const {createCategory, createProduct, updateProduct, createOrder, fetchProductsByCategory, responseMiddleware, fetchProducts, fetchCategories} = require('../db/mongo');

Router.post('/products', fetchProducts, responseMiddleware);

Router.get('/categories', fetchCategories, responseMiddleware);

Router.put('/category', createCategory, responseMiddleware);

Router.put('/product', createProduct, responseMiddleware);

Router.patch('/:id/product', updateProduct, responseMiddleware);

Router.put('/order', createOrder, responseMiddleware);

Router.get('/:id/products', fetchProductsByCategory, responseMiddleware);

module.exports = Router;