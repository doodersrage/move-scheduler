'use strict';

// Moves controller
angular.module('moves').controller('MovesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moves', '$state',
	function($scope, $stateParams, $location, Authentication, Moves, $state ) {
		$scope.authentication = Authentication;

		// Create new Move
		$scope.create = function() {
			// Create new Move object
			var move = new Moves ({
				name: this.name
			});

			// Redirect after save
			move.$save(function(response) {
				$location.path('moves/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Move
		$scope.remove = function( move ) {
			if ( move ) { move.$remove();

				for (var i in $scope.moves ) {
					if ($scope.moves [i] === move ) {
						$scope.moves.splice(i, 1);
					}
				}
			} else {
				$scope.move.$remove(function() {
					$location.path('moves');
				});
			}
		};

		// Update existing Move
		$scope.update = function() {
			var move = $scope.move ;

			move.$update(function() {
				$location.path('moves/' + move._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Moves
		$scope.find = function() {
			$scope.moves = Moves.query();
		};

		// Find existing Move
		$scope.findOne = function() {
			$scope.move = Moves.get({
				moveId: $stateParams.moveId
			});
		};

		// custom functions based on client requests
		$scope.nextStep = function(step){

			// apply correct step methods based on assigned step string
			switch(step){
				case 'moveTypeDate':

					// add code to check availability here

					// call correct state
					$state.go('setupMove.available');

				break;
			}

		};

		$scope.delayRedirect = function(seconds,state){
			setTimeout($state.go(state), (Number(seconds) * 10000));
		};

	}
]);
