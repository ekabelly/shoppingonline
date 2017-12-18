//$scope= {
//	spinner: css spinner ng-if
//	[req]: anything successHandler handles, such as user
// user: the user thats using the system
//	err: an err logging in atm
//	orderKey: vale: the keys that are found in the order object. display: the value which wil be displayed at the table's th
//	cart: the order/cart that is being handled atm
//	categories: all the store categories and products.
//	navCategory: an array of products. might be a category or search value.
// promotion: an array of products being displayed in the carousel.
// }


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

	const initCart = () =>{
		$scope.cart = $scope.user.orders.find(order=>$cookies.get('cart') === order._id);
		fetchCategoreis();
	}

	const fetchCategoreis = () =>$http.get('/store/categories').then(res=>{
		console.log(res.data.data);
		$scope.categories = res.data.data;
		setCategory();
	});

	const setCategory = () =>{
		$scope.navCategory = $scope.categories[2].products;
	}

	$scope.changeCategory = i =>{
		$scope.navCategory = $scope.categories[i].products;
		console.log($scope.navCategory, i);
	}

	$scope.displayAllProducts = () =>{
		$scope.navCategory = [];
		$scope.categories.forEach(category=>$scope.navCategory = $scope.navCategory.concat(category.products));
	}

	$scope.promotion = [{name:'watch dogs', price:'60$', src:'https://i.pinimg.com/736x/3b/5d/22/3b5d22ba69dffe36bf1c1cf908195d4d--playstation--console-playstation-games.jpg'},
	{name:'Batman: Arkham Knight', price:'60$', src:'https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/102/10207/10207566.jpg'},
	{name:'Doom 2017', price:'60$', src:'https://multimedia.bbycastatic.ca/multimedia/products/500x500/103/10380/10380094.jpg'},
	{name:'dishonored: death of the outsider', price:'60$', src:'https://pcgames-download.com/wp-content/uploads/2017/09/Dishonored-Death-of-the-Outsider-PC-2017.jpg'}]

	isAuthenticated();

});