'use strict';

angular.module('noDJ', [
  'ngRoute',
  'youtube-embed'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider.
	when('/', {
		templateUrl: 'main.html'
	}).
	when('/:roomId', {
		templateUrl: 'server.html'
	}).
	when('/:roomId/client', {
		templateUrl: 'client.html'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);
