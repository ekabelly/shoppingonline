const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
		type:String,
		required:true
	}

const OrderSchema = new Schema({
	userId:requiredString,
	finalPrice:Number,
	city:String,
	street:String,
	shippingDate:Date,
	orderDate:Date,
	lastDigits:String,
	products:[{type:Schema.Types.ObjectId, ref:'Product'}]
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;