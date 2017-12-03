const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
		type:String,
		required:true
	}

const OrderSchema = new Schema({
	userId:requiredString,
	finalPrice:String,
	city:String,
	street:String,
	shippingDate:String,
	orderDate:String,
	lastDigits:String,
	products:{
		type: Array,
		required: true
	}
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;