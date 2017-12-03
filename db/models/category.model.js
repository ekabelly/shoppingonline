const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredUniqueString = {
		type:String,
		required:true,
		unique:true
	}

const CategorySchema = new Schema({
	name:requiredUniqueString,
	products:[{type:Schema.Types.ObjectId, ref:'Product'}]
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;