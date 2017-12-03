app.controller('Login', ($scope, $http) => {
	$scope.user = false;
	$scope.products = false;
	$scope.user = false;

	const successHandler = (req, res) =>$scope[req] = res.data.data;
	const errHnadler = err =>$scope.err = err.status === 400 ? 'Please Fill All The Fields Correctly' : 'Wrong Email Or Password';

	$scope.fetchProducts = () =>{
		// console.log('fetchProducts');
		if (!$scope.products) {
			$http.get('/products').then(response=>successHandler('products', response));
		}
	}

	$scope.fetchOrders = () =>{
		if (!$scope.orders) {
			$http.get('/orders').then(response=>successHandler('orders', response));
		}
	}

	$scope.initLogin = () =>$http.post('/login', {username:$scope.login.email, password:$scope.login.pass}).then(response=>successHandler('user', response)).catch(err=>errHnadler(err));
});