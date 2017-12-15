const app = angular.module("App", ['ngCookies']);

app.controller('Store', ($scope, $http, $cookies) => {
	$http.get('/user').then(data=>console.log(data));
});