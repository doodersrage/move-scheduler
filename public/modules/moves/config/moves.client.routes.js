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
		// setup project methods
		state('setupMove', {
			abstract: true,
			url: '/moves/setup',
			controller: 'MovesController',
			templateUrl: 'modules/moves/views/setup.client.view.html'
		}).
		state('setupMove.first', {
			url: '',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/first.client.view.html'
		}).
		state('setupMove.unavailable', {
			url: '/unavailable',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/unavailable.client.view.html'
		}).
		state('setupMove.possible', {
			url: '/possible',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/possible.client.view.html'
		}).
		state('setupMove.available', {
			url: '/available',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/available.client.view.html'
		}).
		state('setupMove.location', {
			url: '/location',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/location.client.view.html'
		}).
		state('setupMove.deliveryAddressDistance', {
			url: '/delivery-address-distance',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/delivery-address-distance.client.view.html'
		}).
		state('setupMove.destinationAddressDistance', {
			url: '/destination-address-distance',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/destination-address-distance.client.view.html'
		}).
		state('setupMove.toBeMoved', {
			url: '/to-be-moved',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/to-be-moved.client.view.html'
		}).
		state('setupMove.movingToType', {
			url: '/moving-to-type',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/moving-to-type.client.view.html'
		}).
		state('setupMove.pickUpDropOff', {
			url: '/pick-up-drop-off',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/pick-up-drop-off.client.view.html'
		}).
		state('setupMove.dependingLocation', {
			url: '/depending-location',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/depending-location.client.view.html'
		}).
		state('setupMove.primaryAccess', {
			url: '/primary-access',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/primary-access.client.view.html'
		}).
		state('setupMove.deliveryAccess', {
			url: '/delivery-access',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/delivery-access.client.view.html'
		}).
		state('setupMove.intermission', {
			url: '/intermission',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/intermission.client.view.html'
		}).
		state('setupMove.clarifyWarning', {
			url: '/clarify-warning',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/clarify-warning.client.view.html'
		}).
		state('setupMove.standardRoom', {
			url: '/standard-room',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/standard-room.client.view.html'
		}).
		state('setupMove.packedReady', {
			url: '/packed-ready',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/packed-ready.client.view.html'
		}).
		state('setupMove.fewThings', {
			url: '/few-things',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/few-things.client.view.html'
		}).
		state('setupMove.oneMoreThing', {
			url: '/one-more-thing',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/one-more-thing.client.view.html'
		}).
		state('setupMove.roomsMoving', {
			url: '/rooms-moving',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/rooms-moving.client.view.html'
		}).
		state('setupMove.movingType', {
			url: '/moving-type',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/moving-type.client.view.html'
		}).
		state('setupMove.bigStuff', {
			url: '/big-stuff',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/big-stuff.client.view.html'
		}).
		state('setupMove.appliances', {
			url: '/appliances',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/appliances.client.view.html'
		}).
		state('setupMove.appliancesOptions', {
			url: '/appliances-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/appliances-options.client.view.html'
		}).
		state('setupMove.attic', {
			url: '/attic',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/attic.client.view.html'
		}).
		state('setupMove.atticOptions', {
			url: '/attic-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/attic-options.client.view.html'
		}).
		state('setupMove.basement', {
			url: '/basement',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/basement.client.view.html'
		}).
		state('setupMove.basementOptions', {
			url: '/basement-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/basement-options.client.view.html'
		}).
		state('setupMove.garage', {
			url: '/garage',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/garage.client.view.html'
		}).
		state('setupMove.garageOptions', {
			url: '/garage-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/garage-options.client.view.html'
		}).
		state('setupMove.shed', {
			url: '/shed',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/shed.client.view.html'
		}).
		state('setupMove.shedOptions', {
			url: '/shed-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/shed-options.client.view.html'
		}).
		state('setupMove.patioFurniture', {
			url: '/patio-furniture',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/patio-furniture.client.view.html'
		}).
		state('setupMove.patioFurnitureOptions', {
			url: '/patio-furniture-options',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/patio-furniture-options.client.view.html'
		}).
		state('setupMove.disassembly', {
			url: '/disassembly',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/disassembly.client.view.html'
		}).
		state('setupMove.estimate', {
			url: '/estimate',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/estimate.client.view.html'
		}).
		state('setupMove.summary', {
			url: '/summary',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/summary.client.view.html'
		}).
		state('setupMove.saveProgress', {
			url: '/save-progress',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/save-progress.client.view.html'
		}).
		state('setupMove.progressSaved', {
			url: '/progress-saved',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/progress-saved.client.view.html'
		}).
		state('setupMove.goodBye', {
			url: '/good-bye',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/good-bye.client.view.html'
		}).
		// various form warnings
		state('setupMove.offEstimate', {
			url: '/off-estimate',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/off-estimate.client.view.html'
		}).
		state('setupMove.extDisassemblyHours', {
			url: '/ext-disassembly-hours',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/ext-disassembly-hours.client.view.html'
		}).
		state('setupMove.minCostWarning', {
			url: '/min-cost-warning',
			parent: 'setupMove',
			templateUrl: 'modules/moves/views/setup/min-cost-warning.client.view.html'
		}).
		// generic CRUD modules
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
