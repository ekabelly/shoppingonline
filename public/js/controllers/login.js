app.controller('Login', ($scope, $http, $cookies) => {

	//general funtions

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

	const fetchItems = items =>$http.get('/'+items).then(response=>successHandler(items, response.data.data));

	const isAuthenticated = () =>$http.get('/user').then(res=>{
		successHandler('user', res.data.data);
	}).catch(err=>{
		$scope.user = false;
		$scope.spinner = false;
	});

	const initPage = () =>{
		$scope.products = false;
		$scope.spinner = true;
		isAuthenticated();
	}

	initPage();
	
	$scope.clickEventFetchItems = items =>{
		if (!$scope[items]) { 
			fetchItems(items);
		}
	}

	$scope.initLogin = () =>$http.post('/login', {username:$scope.login.email, password:$scope.login.pass}).then(response=>{
		successHandler('user', response.data.data);
		// console.log(response.data.data)
	}).catch(err=>errHnadler(err));

	$scope.initSignup = () =>{
		if($scope.signup.password !== $scope.signup.pass2){
			$scope.err = "Passwords Don't Match";
			return;
		}
		const {username, password, fName, lName, city, street} = $scope.signup;
		$http.post('/signup', {username, password, fName, lName, city, street, role:'customer'}).then(response=>
			successHandler('newUser', response.data.user)).catch(err=>errHnadler(err));
	}

	$scope.cartHandler = id =>$cookies.put('cart', id, {path:'/'});
	
});