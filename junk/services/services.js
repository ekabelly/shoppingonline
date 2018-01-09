const services = ($http, $cookies) => {
	const logout = () =>{
		$cookies.remove('cart');
		$cookies.remove('ougia');
		$http.get('/logout');
	}

	return {logout}
}

app.factory('Services', services);




	const adminHandler = role =>{
		if (role === 'admin') $http.post('/admin', {email:$scope.login.email}).then(x=>console.log(x)).catch(err=>console.log(err));
	}