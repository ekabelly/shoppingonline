app.directive('card', ()=> {
	return {
		restrict: 'E',
		template: 	`<div class="card col-md-3">
						<div>
							<img class="card-img-top" src="{{data.picture}}" width='150' style="max-hieght:150px;" alt="Card image cap" />
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