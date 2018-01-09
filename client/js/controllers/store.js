//$scope= {
//	spinner: css spinner ng-if
//	[req]: anything successHandler handles, such as user
// user: the user thats using the system
//	err: an err logging in atm
//	orderKey: vale: the keys that are found in the order object. display: the value which wil be displayed at the table's th
//	cart: the order/cart that is being handled atm
//	categories: all the store categories and products.
//	navCategory: an array of products. might be a category or search value.

app.controller('Store', ($scope, $http, $cookies, $timeout) => {

	//----------------general functions

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
		successHandler('user', res.data.data, initCart);
	}).catch(err=>{
		console.log(err)
		$scope.user = false;
		$scope.spinner = false;
	});

	const initPgae = () =>{
		$scope.data = {
			showCart:ifCart(),
			today: new Date(),
			invoice: 'http://localhost:4001/store/'+$cookies.get('cart')+'/invoice'
		};
		// console.log($scope.data.today);
		isAuthenticated(); 
	}

	const transformDate = dateType =>$scope.data[dateType] = new Date($scope.cart[dateType]);

	const createCookie = (key, val) =>$cookies.put(key, val);

//------------------------------cart functions
	const initCart = () =>{
		$scope.finalPrice = 0;
		if($cookies.get('cart')){
			findCart(); //instead of using fetchCart and doing an http req to server, using the data that is already on the client
			if($scope.cart){
				filterProductsArr();
				// console.log($scope.cart);
			}
		}
		fetchCategoreis();
	}

	const findCart = () =>{
		$scope.cart = $scope.user.orders.find(order=>$cookies.get('cart') === order._id);
		transformDate('orderDate');
	}

	const manageProductsDisp = product =>{
		if($scope.productsDisp[product._id]){
			$scope.productsDisp[product._id].q++;
		}else{
			$scope.productsDisp[product._id] = {
				val:product,
				q: 1
			}
		}
	}

	const filterProductsArr = () =>{
		$scope.productsDisp = {};
		$scope.change = 0;
		$scope.temp = 1;
		$scope.cart.products.forEach(product=>{
			manageProductsDisp(product);
		});
		$scope.setFinalPrice($scope.productsDisp);
	}

	$scope.setFinalPrice = products =>{
		$scope.change++;
		$scope.finalPrice = 0;
		Object.keys(products).forEach(i=>{
			$scope.finalPrice += products[i].q * products[i].val.price;
			if (!products[i].q) delete $scope.productsDisp[i]; //if q is 0 delete the product from the display arr
		});
		if ($scope.finalPrice === 0) $scope.productsDisp = false;
	}

	$scope.removeProduct = id =>{
		$scope.productsDisp[id].q = 0;
		$scope.setFinalPrice($scope.productsDisp);
	}

	$scope.addToCart = product =>{
		$scope.data.showCart = true;
		// $scope.$apply();
		if(!$scope.productsDisp) $scope.productsDisp = {};
		manageProductsDisp(product);
		$scope.setFinalPrice($scope.productsDisp);
	}

	$scope.saveCart = () =>{
		if($scope.change === $scope.temp) return;
		$scope.change = $scope.temp;
		dispToCart();
	}

	const dispToCart = () =>{
		const products = $scope.productsDisp;
		$scope.cart = {
			userId:$scope.user._id,
			products: [],
			finalPrice: $scope.finalPrice,
			orderDate: Date.now()
		};
		Object.keys(products).forEach(id=>{
			for (let i = 0; i < products[id].q; i++) {
				$scope.cart.products.push(id);
			}
		});
		setCart();
	}

	const setCart = () =>{
		if ($cookies.get('cart')) return patchOrder($cookies.get('cart'));
		return putOrder();
	}

	const validateCart = () =>{
		const {cart} = $scope;
		if(cart.shippingDate && cart.street && cart.city){
			$scope.err = false;
			return true;
		} 
		$scope.err = 'please fill all the fields Correctly';
		return false;
	}

	const ifCart = () => $cookies.get('cart') ? true : false;

	$scope.logout = () =>{
		$cookies.remove('cart', {path:'/'});
		$cookies.remove('cart');
	}

	$scope.hideCart = () =>$scope.data.showCart = false;

//--------------------------products & categories functions
	
	$scope.displayAllProducts = () =>{
		$scope.navCategory = [];
		$scope.navCategory = [...$scope.allProducts];
	}
	
	const fetchCategoreis = () =>$http.get('/store/categories').then(res=>{
		// console.log(res.data.data);
		$scope.categories = res.data.data;
		makeAllProductsArr($scope.displayAllProducts);
	});

	$scope.changeCategory = i =>$scope.navCategory = $scope.categories[i].products;

	const makeAllProductsArr = cb =>{
		$scope.allProducts = [];
		$scope.categories.forEach(category=>$scope.allProducts = [...$scope.allProducts, ...category.products]);
		if (cb) cb();
	}

//-------------------------------------------order(complete cart) functions

	$scope.orderNow = () =>{
		if ($scope.data.shippingDate) {
			$scope.cart.shippingDate = new Date($scope.data.shippingDate);
		}
		if(validateCart()){
			patchOrder($cookies.get('cart'), ()=>window.location.assign('/store/#!/thanks'));
		}
	}

	const patchOrder = (id, cb) =>$http.patch('/store/'+id+'/order', $scope.cart).then(res=>{
		orderSuccess(id);
		if(cb) cb();
	}).catch(err=>errHnadler(err));

	const putOrder = () =>$http.put('/store/order', $scope.cart).then(res=>{
		createCookie('cart', res.data.data._id);
		orderSuccess(res.data.data._id);
	}).catch(err=>errHnadler(err));

	const orderSuccess = id =>{
		fetchOrder(id);
		$scope.orderSuccess = true;
		$timeout(()=>$scope.orderSuccess = false, 2500);
	}

	const fetchOrder = id =>$http.get('/store/'+id+'/order').then(res=>{
		successHandler('cart', res.data.data[0]);
		transformDate('orderDate');
	}).catch(err=>errHnadler(err));

//------------------------------------------------

	initPgae();

});