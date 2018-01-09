app.directive('card', ()=> {
	return {
		restrict: 'E',
		template: 	`<div class="card col-md-3 thumbnail" style="height:400px;">
						<div class="container-fluid form-group">
							<div class="row">
								<div class="col-md-6">
									<img class="card-img-top" ng-show="data.pics[product._id]" src="{{data.pics[product._id]}}" width='150' style="max-height:180px;" alt="Product Pic" />
									<img class="card-img-top" ng-if="!data.pics[product._id]" src="{{product.picture}}" width='150' style="max-height:180px;" alt="Product Pic" />
								</div>
								<div class="col-md-6 container-fluid">
									<div class="row">
										<div class="col-md-12">
											<input type="file" class="form-control" id="pic{{product._id}}">
										</div>
										<div class="col-md-12">
											<button class="btn btn-default" ng-click="upload(product._id)">Upload Picture</button>
										</div>
									</div>
								</div>
							</div>
								<div class="row card-block form-group"> 
								<span class="card-text">
									<ul class="list-group list-group-flush"> 
										<li class="cardText"> <strong>Name:</strong> <input class="form-control" type="text" ng-model="product.name"> </li>
										<li class="cardText"> <strong>Price:</strong> <input class="form-control" type="text" ng-model="product.price"> </li>
									</ul>
								</span>
							</div>
							<div class="row">
								<div class="col-md-offset-3">
									<button data-toggle="tooltip" data-placement="top" title="Save Changes" ng-click="patchProduct(product)" class="btn btn-default">Save Changes <span class="glyphicon glyphicon-floppy-save"></span></button>
								</div>
							</div>
						</div>
					</div>`
	}
});