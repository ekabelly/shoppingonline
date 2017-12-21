module.exports = {
	dburl:'mongodb://localhost:27017',
	secret: '1234alluneedisLove',
	cookieName:'ougia',
	userResponse:(req, res)=>res.json({success:true, data:{orders: req.data, fName:req.user.fName, lName:req.user.fName, role:req.user.role, _id:req.user._id}})
}