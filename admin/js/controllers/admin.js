app.controller('Admin', ($scope, $http) => {

//------------------------------general funcions

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
		return $scope.err[errType] = err;
	}

	const errOffHandler = errType =>$scope.err[errType] = '';

	const isAuthenticated = () =>$http.get('/user').then(res=>{
		successHandler('user', res.data.data);
		fetchCategoreis();
	}).catch(err=>{
		$scope.user = false;
		$scope.spinner = false;
	});

	$scope.logout = () =>{
		$cookies.remove('cart', {path:'/'});
		$cookies.remove('cart');
	}

	const initPgae = () =>{
		$scope.err = {};
		$scope.data = {
			newCategory:'',
			newProduct:{},
			pics:{}
		}
		isAuthenticated(); 
	}

//-------------------------------------------categpries and products display functions

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

	$scope.displayAllProducts = () =>{
		$scope.navCategory = [];
		$scope.navCategory = $scope.allProducts.slice();
	}

//-------------------------------------edit and new products

	$scope.patchProduct = product =>{
		if ($scope.data.pics[product._id]) product.picture = $scope.data.pics[product._id];
		$http.patch(product._id+'/product', product).then(res=>console.log(res)).catch(err=>errHnadler(err, 'newProduct'));
	}

	$scope.putCategory = () =>{
		if (!$scope.data.newCategory) return errHnadler('Please Fill All Fields', 'newCategory'); 
		$http.put('/admin/category', {name:$scope.data.newCategory}).then(res=>{
			$scope.newCategory = ''; 
			putSuccessHandler('newCategory');
		}).catch(err=>errHnadler(err, 'newCategory'));
	}

	$scope.putProduct = () =>{
		if(categoryHandler()) return;
		$http.put('/admin/product', $scope.data.newProduct).then(res=>{
			$scope.data.newProduct = {};
			putSuccessHandler('newProduct');
		}).catch(err=>errHnadler(err, 'newProduct'));
	}

	const putSuccessHandler = errType =>{
		errOffHandler(errType);
		fetchCategoreis();
	}

	const categoryHandler = () =>{
		if (!$scope.data.newProduct.categoryName || !$scope.data.newProduct.name || !$scope.data.newProduct.price) {
			errHnadler('Please Fill All Fields', 'newProduct');
			return true;
		}
		const category = $scope.categories.find(category=>category.name === $scope.data.newProduct.categoryName);
		$scope.data.newProduct.categoryId = category._id;
		return false
	}

	$scope.upload = id =>{
		const file = document.getElementById('pic'+id);
		const formData = new FormData();
		formData.append('sampleFile', file.files[0]);
		console.log(file.files[0]);
		uploadReq(formData, id, file.files[0].name);
	}

	const uploadReq = (formData, id, fileName) =>{
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				if (id) {
					$scope.data.pics[id] = '/login/upload/'+fileName;
				}else{
					$scope.data.newProduct.picture = '/login/upload/'+fileName;
				}
				$scope.$apply();
			}
		}
		xhr.open('post', 'http://localhost:4001/admin/image');
		xhr.send(formData);
	}

//---------------------------------------------

	initPgae();

});