app.directive('card', ()=> {
	return {
		restrict: 'E',
		template: 	`<div class="card col-md-3" style="height:300px;">
						<div class="container-fluid">
							<div class="row">
								<div class="col-md-9">
									<img class="card-img-top" src="{{data.picture}}" width='150' style="max-height:180px;" alt="Card image cap" />
								</div>
								<div class="col-md-1">
									<span class="glyphicon glyphicon-plus btn btn-default btn-sm"></span>
								</div>
							</div>
						</div>
						<div class="card-block"> 
							<span class="card-text">
								<ul class="list-group list-group-flush"> 
									<li class="cardText"> Name: {{data.name}} </li>
									<li class="cardText"> Price: {{data.price}} </li>
								</ul>
							</span>
						</div>
					</div>`,
		scope:{
			data: '='
		}
	}
});