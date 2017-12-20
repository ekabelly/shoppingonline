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
const promotion = [{name:'watch dogs', price:'60$', src:'https://i.pinimg.com/736x/3b/5d/22/3b5d22ba69dffe36bf1c1cf908195d4d--playstation--console-playstation-games.jpg'},
	{name:'Batman: Arkham Knight', price:'60$', src:'https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/102/10207/10207566.jpg'},
	{name:'Doom 2017', price:'60$', src:'https://multimedia.bbycastatic.ca/multimedia/products/500x500/103/10380/10380094.jpg'},
	{name:'dishonored: death of the outsider', price:'60$', src:'https://pcgames-download.com/wp-content/uploads/2017/09/Dishonored-Death-of-the-Outsider-PC-2017.jpg'}];

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
		//$scope.cart.products manipulation each products has products.q
		filterProductsArr();
		fetchCategoreis();
	}

	const fetchCategoreis = () =>$http.get('/store/categories').then(res=>{
		console.log(res.data.data);
		$scope.categories = res.data.data;
		setCategory();
	});

	const setCategory = () =>$scope.navCategory = $scope.categories[2].products;

	$scope.changeCategory = i =>$scope.navCategory = $scope.categories[i].products;

	$scope.displayAllProducts = () =>{
		$scope.navCategory = [];
		$scope.categories.forEach(category=>$scope.navCategory = $scope.navCategory.concat(category.products));
	}

	const filterProductsArr = () =>{
		$scope.productsDisp = {};
		$scope.change = 0;
		$scope.temp = 1;
		$scope.cart.products.forEach(product=>{
			manageProductsDisp(product);
		});
	}

	const manageProductsDisp = product =>{
		if($scope.productsDisp[product.name]){
				$scope.productsDisp[product.name].q++;
			}else{
				$scope.productsDisp[product.name] = {}
				$scope.productsDisp[product.name].val = product;
				$scope.productsDisp[product.name].q = 1;
			}
	}

	$scope.setFinalPrice = () =>{
		$scope.change++;
		const products = $scope.productsDisp;
		$scope.cart.finalPrice = 0;
		Object.keys(products).forEach(i=>{
			$scope.cart.finalPrice += products[i].q * products[i].val.price;
			if (!products[i].q) {
				delete $scope.productsDisp[i];
			}
		});
	}

	$scope.removeProduct = productName =>{
		$scope.productsDisp[productName].q = 0;
		$scope.setFinalPrice();
	}

	$scope.addToCart = product =>{
		manageProductsDisp(product);
		$scope.setFinalPrice();
	}

	$scope.saveCart = () =>{
		if($scope.change === $scope.temp){
			return;
		}
		//$scope.productsDisp.change = $scope.productsDisp.temp;
		//setCart;
	}

	const initPgae = () =>{
		$scope.promotion = promotion;
		isAuthenticated();
	}

	initPgae();

});