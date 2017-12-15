const loginServices = ($scope, $http) => {

	const successHandler = (req, res) =>{
		$scope[req] = res;
		$scope.spinner = false;
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
		successHandler('user', res.data.data);
	}).catch(err=>{
		$scope.user = false;
		$scope.spinner = false;
	});

	return {successHandler, errHnadler, isAuthenticated}
}

app.factory('LoginServices', loginServices);