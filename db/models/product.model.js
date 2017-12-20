const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	price:{
		type:Number,
		required: true	
	},
	picture:String
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;