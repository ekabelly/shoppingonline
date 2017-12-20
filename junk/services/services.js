const services = ($http, $cookies) => {
	const logout = () =>{
		$cookies.remove('cart');
		$cookies.remove('ougia');
		$http.get('/logout');
	}

	return {logout}
}

app.factory('Services', services);