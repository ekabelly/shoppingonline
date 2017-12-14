const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
		type:String,
		required:true
	}

const UserSchema = new Schema({
	role:requiredString,
	email:{
		type:String,
		required:true,
		unique:true
	},
	fName:requiredString,
	lName:requiredString,
	pass:requiredString,
	city:String,
	street:String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;