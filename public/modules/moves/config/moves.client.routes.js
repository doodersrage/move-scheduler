'use strict';

//Setting up route
angular.module('moves').config(['$stateProvider',
	function($stateProvider) {
		// Moves state routing
		$stateProvider.
		state('listMoves', {
			url: '/moves',
			templateUrl: 'modules/moves/views/list-moves.client.view.html'
		}).
		state('createMove', {
			url: '/moves/create',
			templateUrl: 'modules/moves/views/create-move.client.view.html'
		}).
		state('viewMove', {
			url: '/moves/:moveId',
			templateUrl: 'modules/moves/views/view-move.client.view.html'
		}).
		state('editMove', {
			url: '/moves/:moveId/edit',
			templateUrl: 'modules/moves/views/edit-move.client.view.html'
		});
	}
]);