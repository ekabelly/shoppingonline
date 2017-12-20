app.directive('textInput', ()=> {
	return {
		restrict:'E',
		template: `<div>
						<label for="{{myid}}" class="col-sm-2 control-label">{{ph}}</label>
						<div class="{{myclass}}">{{myid}}
							<input type="{{type}}" class="form-control" ng-model="ngmodel" id="{{myid}}" placeholder="{{ph}}" required="{{required}}"></input>
						</div>
					</div>`,
		scope:{
			myid:'=',
			ph:'=',
			myclass:'=',
			type:'=',
			ngmodel:'=',
			required:'='
		}
	}
});