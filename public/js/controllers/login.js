app.controller('Login', ($scope, $http) => {
	$scope.user = false;
	$scope.products = false;
	$scope.user = false;

	const successHandler = (req, res) =>$scope[req] = res.data.data;
	const errHnadler = err =>{
		if (err.status === 400) {
			return $scope.err = 'Please Fill All The Fields Correctly';
		}
		if (err.status === 401) {
			return $scope.err = 'Wrong Email Or Password';
		}
		return $scope.err = err;
	} 

	$scope.fetchProducts = () =>{
		// console.log('fetchProducts');
		if (!$scope.products) {
			$http.get('/products').then(response=>successHandler('products', response));
		}
	}

	$scope.fetchOrders = () =>{
		if (!$scope.orders) {
			$http.get('/orders').then(response=>{
				$scope.orderKeys = ['ShiipingDate', 'City', 'Products'];
				successHandler('orders', response);
			});
		}
	}

	$scope.initLogin = () =>$http.post('/login', {username:$scope.login.email, password:$scope.login.pass}).then(response=>successHandler('user', response)).catch(err=>errHnadler(err));

	$scope.initSignup = () =>{
		if($scope.signup.password !== $scope.signup.pass2){
			$scope.err = "Passwords Don't Match";
			return;
		}
		const {username, password, fName, lName, city, street} = $scope.signup;
		$http.post('/signup', {username, password, fName, lName, city, street, role:'customer'}).then(response=>successHandler('user', response)).catch(err=>errHnadler(err));
	}
});