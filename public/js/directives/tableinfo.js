app.directive('tableInfo', ()=> {
	return {
		restrict: 'E',
		template: `<div class="table">
					<table class="table table-hover">
						<tr>
							<th ng-repeat="(key, field) in datakeys.display"> {{field}} </th>
						</tr>
						<tr ng-repeat="(i, val) in data">
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'shippingDate'"> <a ng-if="!val['shippingDate']"> Start Shopping With This Order </a> <p ng-if="val['shippingDate']">{{val[field]}}</p> </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field !== 'picture' && field !== 'products' && field !== 'shippingDate'"> {{val[field]}} </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'picture'"> <img src={{val[field]}} width="30" /> </td>
							<td ng-repeat="(i, field) in datakeys.value" ng-if="field === 'products'"> <ul><li ng-repeat="product in val[field]">{{product.name}}</li><ul> </td>
						</tr>
					</table>
				</div>`,
		scope:{
			data: '=',
			datakeys:'='
		}
	}
});