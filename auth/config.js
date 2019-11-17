module.exports = {
	dburl:'mongodb://localhost:27017/shoppingonline',
	secret: '1234alluneedislove',
	cookieName:'ougia',
	userResponse:(req, res)=>res.json({success:true, data:{orders: req.data, fName:req.user.fName, lName:req.user.fName, street:req.user.street, city:req.user.city, role:req.user.role, _id:req.user._id}})
}