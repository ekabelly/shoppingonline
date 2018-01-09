app.controller('NavCont', ($scope, $http, $cookies) => {

	const successHandler = (req, res, cb) =>{
		$scope[req] = res;
		$scope.spinner = false;
		if (cb) cb();
	}

	const isAuthenticated = () =>$http.get('/user').then(res=>{
		successHandler('user', res.data.data);
	}).catch(err=>{
		console.log(err)
		$scope.user = false;
	});

	$scope.logout = () =>{
		$cookies.remove('cart', {path:'/'});
		$cookies.remove('cart');
	}

	isAuthenticated();

});