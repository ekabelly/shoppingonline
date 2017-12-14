app.controller('Login', ($scope, $http) => {
	$scope.user = false;
	$scope.products = false;
	$scope.user = false;

	$scope.tablefields = field =>{
		console.log(field);
		return field !== 'products' && field !== 'picture';
	}

	const successHandler = (req, res) =>$scope[req] = res;
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
			$http.get('/products').then(response=>{
				$scope.productKeys = {value:['name', 'price', 'picture'], display:['Name', 'Price', 'Picture']}
				successHandler('products', response.data.data);
			});
		}
	}

	$scope.fetchOrders = () =>{
		if (!$scope.orders) {
			$http.get('/orders').then(response=>{
				$scope.orderKeys = {value:['shippingDate', 'orderDate', 'city', 'finalPrice', 'products'], display:['Shipping Date', 'Order Date', 'City', 'Final Price', 'Products']};
				successHandler('orders', response.data.data);
			});
		}
	}

	$scope.initLogin = () =>$http.post('/login', {username:$scope.login.email, password:$scope.login.pass}).then(response=>{
		console.log(response.data.data);
		$scope.orderKeys = {value:['shippingDate','orderDate', 'city', 'street', 'finalPrice', 'products'], display:['Shipping Date', 'Order Date', 'City', 'Street', 'Final Price', 'Products']};
		successHandler('data', response.data.data);
	}).catch(err=>errHnadler(err));

	$scope.initSignup = () =>{
		if($scope.signup.password !== $scope.signup.pass2){
			$scope.err = "Passwords Don't Match";
			return;
		}
		const {username, password, fName, lName, city, street} = $scope.signup;
		$http.post('/signup', {username, password, fName, lName, city, street, role:'customer'}).then(response=>{
			console.log(response.data.user)
			successHandler('user', response.data.user);
		}).catch(err=>errHnadler(err));
	}
});