const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
		type:String,
		required:true
	}

const ProductSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	price:requiredString,
	picture:String
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;