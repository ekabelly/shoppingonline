const fs = require('fs');
const path = require('path');

const createSuccessResponse = data => ({data, success: true});
const responseMiddleware = (req, res) => res.json(createSuccessResponse(req.data));

const uploadFile = (req, res) =>{
	if (!req.files) return res.status(400).send('No files were uploaded.');
	const {sampleFile} = req.files;
	// console.log(sampleFile);
	fs.writeFile(path.join(__dirname, `/public/upload/`, sampleFile.name), sampleFile.data, (err) => res.json({err}));
}

const createRegex = regStr =>{
	const regex = {
		cvv:'^[0-9]{3,4}$',
		cardNumber:'^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$'
	}
	return new RegExp(regex[regStr]);
}

const checkCreditCard = (req, res, next) =>{
	const {creditCard, cvv} = req.body;
	if(creditCard || cvv){
		if (createRegex('cardNumber').test(creditCard) && createRegex('cvv').test(cvv)) {
			chargeCustomer();
			req.body.lastDigits = creditCard.substr(creditCard.length - 4);
			return next();
		}
		return res.json({status:'fail', messege:'credit card incorrect'});
	}
	return next();
}

const chargeCustomer = () =>console.log('charging credit card');

const validateFinalPrice = (req, res, next) =>{
	let finalPrice = 0;
	req.data.forEach(product=>finalPrice += product.price);
	if (finalPrice === req.body.finalPrice) {
		return next();
	}
	return res.json({status:'fail', messege:'no cheating!'});
}

const bookedDates = (req, res, next) =>{
	const miliDay = 24*60*60*1000; //a day in miliseconds, 86,400,000
	const {shippingDate} = req.body;
	console.log(shippingDate);
	Object.keys(createDatesArr(req.data)).forEach(date=>{
		date = Number(date);
		if (shippingDate > date-miliDay && shippingDate < date+miliDay) { //this means the requested shipping date is the same 24h as a fully booked date
			req.data = {validDate:false};
			return next();
		}
	});
	req.data = {validDate:true};
	return next();
}

const createDatesArr = orders =>{
	let dates =  {};
	let blockedDates = {};
	orders.forEach(order=>{
		if (!order.shippingDate) return;
		if(dates[order.shippingDate.getTime()]){
			dates[order.shippingDate.getTime()] += 1;
			if (dates[order.shippingDate.getTime()] >= 3) {
				blockedDates[order.shippingDate.getTime()] = true;
			}
			return;
		}
		return dates[order.shippingDate.getTime()] = 1;
	});
	console.log(blockedDates);
	return blockedDates;
}

module.exports = {uploadFile, checkCreditCard, validateFinalPrice, bookedDates, responseMiddleware};