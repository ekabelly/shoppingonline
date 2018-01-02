app.directive('card', ()=> {
	return {
		restrict: 'E',
		template: 	`<div class="card col-md-3 thumbnail" style="height:400px;">
						<div class="container-fluid form-group">
							<div class="row">
								<div class="col-md-10">
									<strong>Picture:</strong>
									<input type="text" class="form-control" ng-model="product.picture">
									<img class="card-img-top" src="{{product.picture}}" width='150' style="max-height:180px;" alt="Product Pic" />
								</div>
								<div class="col-md-1">
									<span class="glyphicon glyphicon-floppy-save btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Save" ng-click="patchProduct(product)"></span>
								</div>
							</div>
						</div>
						<div class="card-block form-group"> 
							<span class="card-text">
								<ul class="list-group list-group-flush"> 
									<li class="cardText"> <strong>Name:</strong> <input class="form-control" type="text" ng-model="product.name"> </li>
									<li class="cardText"> <strong>Price:</strong> <input class="form-control" type="text" ng-model="product.price"> </li>
								</ul>
							</span>
						</div>
					</div>`
	}
});