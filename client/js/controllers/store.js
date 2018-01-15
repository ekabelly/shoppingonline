app.controller('Store', ($scope, $http, $cookies, $timeout) => {

	//----------------general functions

	const successHandler = (req, res, cb) =>{
		$scope[req] = res;
		$scope.spinner = false;
		if (cb) cb();
	}

	const errHandler = (err, req) =>$scope.err[req] = err;

	const isAuthenticated = () =>$http.get('/user').then(res=>successHandler('user', res.data.data, initCart)).catch(err=>{
		$scope.user = false;
		$scope.spinner = false;
	});

	const initPgae = () =>{
		initScope()
		isAuthenticated(); 
	}

	const finish = () =>{
		$scope.data.invoice = 'http://localhost:4001/store/'+$cookies.get('cart')+'/invoice';
		location.href = "#!finish";
	}

	const transformDate = dateType =>$scope.data[dateType] = new Date($scope.cart[dateType]);

	const createCookie = (key, val) =>$cookies.put(key, val);

	const createRegex = regStr =>{
		const regex = {
			cvv:'^[0-9]{3,4}$',
			cardNumber:'^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$'
		}
		return new RegExp(regex[regStr]);
	}

	const fetchOrders = () =>$http.get('/orders');

	const initScope = () =>{
		$scope.data = {
			showCart:ifCart(),
			today: new Date(),
			invoice: 'http://localhost:4001/store/'+$cookies.get('cart')+'/invoice'
		};
		$scope.err = {};
	}


//------------------------------cart functions
const initCart = () =>{
	$scope.finalPrice = 0;
	if($cookies.get('cart')){
			findCart(); //instead of using fetchCart and doing an http req to server, using the data that is already on the client
			if($scope.cart) filterProductsArr();
		}
		fetchCategoreis();
	}

	const initCartAgain = () =>{ //ths function operates when the cart is being prepared to transfer to server
		$scope.cart = {
			userId:$scope.user._id,
			products: [],
			finalPrice: $scope.finalPrice,
			orderDate: Date.now()
		};
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
		if(!$scope.productsDisp) $scope.productsDisp = {};
		manageProductsDisp(product);
		$scope.setFinalPrice($scope.productsDisp);
	}

	$scope.saveAndCheckOut = () =>{
		if($scope.change === $scope.temp) return finish();
		$scope.saveCart(finish);
	}

	$scope.saveCart = cb =>{
		if($scope.change === $scope.temp) return; // if theres no change, no need to make an http request
		$scope.change = $scope.temp;
		dispToCart(cb);
	}

	const dispToCart = cb =>{
		initCartAgain();
		const products = $scope.productsDisp;
		Object.keys(products).forEach(id=>{
			for (let i = 0; i < products[id].q; i++) {
				$scope.cart.products.push(id);
			}
		});
		setCart(cb);
	}

	const setCart = cb =>{
		if ($cookies.get('cart')) return patchOrder($cookies.get('cart'));
		return putOrder(cb);
	}

	const ifCart = () => $cookies.get('cart') ? true : false;

	$scope.logout = () =>{
		$cookies.remove('cart', {path:'/'});
		$cookies.remove('cart');
	}

	$scope.hideNShowCart = bool =>$scope.data.showCart = bool;

	const creditCard = () =>{
		const {cart} = $scope;
		if (cart.creditDate && createRegex('cardNumber').test(cart.creditCard) && createRegex('cvv').test(cart.cvv)) {
			return true;
		}
		return false;
	}

	const fetchOrder = id =>$http.get('/store/'+id+'/order').then(res=>{
		successHandler('cart', res.data.data[0]);
		transformDate('orderDate');
	}).catch(err=>errHandler(err, 'http'));

//--------------------------products & categories functions

$scope.displayAllProducts = () =>{
	$scope.navCategory = [];
	$scope.navCategory = [...$scope.allProducts];
}

const fetchCategoreis = () =>$http.get('/store/categories').then(res=>{
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
	$scope.data.stopFinish = true;
	if ($scope.data.shippingDate) {
		console.log('shippingDate ok');
		$scope.cart.shippingDate = new Date($scope.data.shippingDate);
		$scope.cart.creditDate = new Date($scope.cart.creditDate);
		return validateShippingDate($scope.data.shippingDate.getTime());
	}
	console.log('err');
	$scope.data.stopFinish = false;
	return errHandler('please fill all the fields Correctly', 'orderNow');
}

const validateShippingDate = date =>$http.post('/store/dates', {shippingDate:date}).then(res=>{
	$scope.data.stopFinish = false;
	if (res.data.data.validDate) { //the server return a booleam wheter this date is booked or not
		console.log(res.data.data);
		return initOrder();
	}
	return errHandler('That Date is Fully Booked. Please Pick Another Date.', 'orderNow');
}).catch(err=>errHandler(err, 'orderNow'));

const initOrder = () =>{
	if(validateCart()){
		patchOrder($cookies.get('cart'), ()=>window.location.assign('/store/#!/thanks'));
	}
}

const patchOrder = (id, cb) =>$http.patch('/store/'+id+'/order', $scope.cart).then(res=>{
	orderSuccess(id);
	if(cb) cb();
}).catch(err=>errHandler(err, 'order'));

const putOrder = cb =>$http.put('/store/order', $scope.cart).then(res=>{
	createCookie('cart', res.data.data._id);
	orderSuccess(res.data.data._id);
	if (cb) cb();
}).catch(err=>errHandler(err, 'order'));

const orderSuccess = id =>{
	fetchOrder(id);
	$scope.orderSuccess = true;
	$scope.err.http = false;
	$timeout(()=>$scope.orderSuccess = false, 2500);
}

$scope.addAddress = () =>{
	$scope.cart = {...$scope.cart,
		street:$scope.user.street,
		city:$scope.user.city
	}
}

const validateCart = () =>{
	const {cart} = $scope;
	if(cart.street && cart.city && creditCard() && cart.shippingDate){
		errHandler('', 'orderNow');
		return true;
	}
	errHandler('Please Fill All The Fields Correctly', 'orderNow');
	return false;
}

//------------------------------------------------

initPgae();

});