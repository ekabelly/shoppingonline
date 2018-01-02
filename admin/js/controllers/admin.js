app.controller('Admin', ($scope, $http) => {

	const successHandler = (req, res, cb) =>{
		$scope[req] = res;
		$scope.spinner = false;
		if (cb) cb();
	}

	const errHnadler = (err, errType) =>{
		console.log(err);
		if (err.status === 401) {
			return $scope.err[errType] = 'You Are Not Authorized. Please Relog.';
		}
		return $scope.err[errType] = err.data.messege;
	}

	const isAuthenticated = () =>$http.get('/user').then(res=>{
		// console.log(res.data.data)
		successHandler('user', res.data.data);
		fetchCategoreis();
	}).catch(err=>{
		// console.log(err)
		$scope.user = false;
		$scope.spinner = false;
	});

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

	$scope.displayAllProducts = () =>{
		$scope.navCategory = [];
		$scope.navCategory = $scope.allProducts.slice();
	}

	$scope.logout = () =>{
		$cookies.remove('cart', {path:'/'});
		$cookies.remove('cart');
	}

	$scope.patchProduct = product =>$http.patch(product._id+'/product', product).then(res=>console.log(res)).catch(err=>errHnadler(err, 'newProduct'));

	$scope.putCategory = () =>$http.put('/admin/category', {name:$scope.data.newCategory}).then(res=>{
		console.log(res);
		$scope.newCategory = '';
		fetchCategoreis();
	}).catch(err=>errHnadler(err, 'newCategory'));

	$scope.putProduct = () =>{
		console.log($scope.data.newProduct);
		$http.put('/admin/product', $scope.data.newProduct).then(res=>{
			console.log(res);
			$scope.data.newProduct = {};
			fetchCategoreis();
		}).catch(err=>errHnadler(err, 'newProduct'));
	}

	const initPgae = () =>{
		$scope.err = {};
		$scope.data = {
			newCategory:'',
			newProduct:{}
		}
		isAuthenticated(); 
	}

	initPgae();

});