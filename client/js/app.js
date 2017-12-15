const app = angular.module("App", ['ngCookies']);

app.controller('Store', ($scope, $http, $cookies) => {

	const successHandler = (req, res, cb) =>{
		$scope[req] = res;
		$scope.spinner = false;
		if (cb) cb();
	}

	const errHnadler = err =>{
		if (err.status === 400) {
			return $scope.err = 'Please Fill All The Fields Correctly';
		}
		if (err.status === 401) {
			return $scope.err = 'Wrong Email Or Password';
		}
		return $scope.err = err;
	}

	const isAuthenticated = () =>$http.get('/user').then(res=>{
		console.log(res.data.data)
		$scope.orderKeys = {value:['shippingDate','orderDate', 'city', 'street', 'finalPrice', 'products'], display:['Shipping Date/Start Shopping', 'Order Date', 'City', 'Street', 'Final Price', 'Products']};
		successHandler('user', res.data.data, initCart);
	}).catch(err=>{
		console.log(err)
		$scope.user = false;
		$scope.spinner = false;
	});

	const initCart = () =>$scope.cart = $scope.user.orders.find(order=>$cookies.get('cart') === order._id);

	isAuthenticated();

});