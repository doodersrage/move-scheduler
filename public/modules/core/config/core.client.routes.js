'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('rates', {
			url: '/rates',
			templateUrl: 'modules/core/views/rates.client.view.html'
		}).
		state('faq', {
			url: '/faq',
			templateUrl: 'modules/core/views/faq.client.view.html'
		});
	}
]);
