const express = require('express');
const Router = express.Router();
const {createCategory, createProduct, updateProduct, responseMiddleware} = require('../db/mongo');

Router.put('/category', createCategory, responseMiddleware);

Router.put('/product', createProduct, responseMiddleware);

Router.patch('/:id/product', updateProduct, responseMiddleware);

module.exports = Router;