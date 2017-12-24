const app = angular.module("App", ['ngRoute', 'ngCookies']);

app.config($routeProvider => {
	$routeProvider.when('/', {
		templateUrl: 'store.html'
	}).when('/finish', {
		templateUrl: 'finish.html'
	});
});