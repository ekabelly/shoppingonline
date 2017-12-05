app.directive('tableInfo', ()=> {
	return {
		restrict: 'A',
		template: `<div  class="table">
					<table class="table table-hover">
						<tr ng-repeat="(key, val) in dataKeys">
							<th> {{val}} </th>
						</tr>
						<tr ng-repeat="(i, val) in data">
							<td ng-repeat="(key, dataKey) in dataKeys"> {{val[dataKey]}} </td>
						</tr>
						<tr ng-repeat="key in [\'title\',\'body\']">
							<td> {{key}}</td>
						</tr>
					</table>
				</div>`,
		scope:{
			data: '=',
			dataKeys:'='
		}
	}
});