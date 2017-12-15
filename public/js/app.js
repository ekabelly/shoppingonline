const app = angular.module("App", ["ngRoute", "ngCookies"]);

app.config($routeProvider => {
	$routeProvider.when('/login_panel', {
		templateUrl: 'login_panel.html'
	}).when('/', {
		templateUrl: 'login_panel.html'
	}).when('/about', {
		templateUrl: 'about.html'
	}).when('/signup', {
		templateUrl: 'signup.html'
	});
});