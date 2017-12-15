app.directive('tableInfo', ()=> {
	return {
		restrict: 'E',
		template: `<div class="table">
					<table class="table table-hover">
						<tr>
							<td>{{test}} {{test2}} hello</td>
						</tr
						<tr>
							<th ng-repeat="(key, field) in datakeys.display"> {{field}} </th>
						</tr>
						<tr ng-repeat="(i, val) in data">
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'shippingDate'"> <a ng-if="!val['shippingDate']" ng-click="cartHandler(val['_id'])"> Start Shopping With This Order </a> <p ng-if="val['shippingDate']">{{val[field]}}</p> </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field !== 'picture' && field !== 'products' && field !== 'shippingDate'"> {{val[field]}} </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'picture'"> <img src={{val[field]}} width="30" /> </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'products'"> <ul><li ng-repeat="product in val[field]">{{product.name}}</li><ul> </td>
						</tr>
					</table>
				</div>`,
		scope:{
			data: '=',
			datakeys:'='
		},
		controller:($scope, $cookies)=>{
			$scope.cartHandler = id =>{
				console.log('cookie '+id);
				$cookies.put('cart', id, {path:'/'});
			}
		}
	}
});