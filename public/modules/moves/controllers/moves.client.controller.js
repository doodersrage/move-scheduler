'use strict';

// Moves controller
angular.module('moves').controller('MovesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moves', '$state',
	function($scope, $stateParams, $location, Authentication, Moves, $state ) {
		$scope.authentication = Authentication;

		// controller vars
		// init new move object
		$scope.move = {
			moveType: '',
			startZip: '',
			destinationZip: '',
			destinationAddressDistance: '',
			appliances: [],
			attic: '',
			basement: '',
			bigStuff: '',
			deliveryAccess: '',
			deliveryAddressDistance: '',
			disassembly: [],
			garage: '',
			movingToType: '',
			patioFurniture: '',
			shed: '',
			tobemoved: '',
			primaryAccess: '',
			roomsMoving: '',
			email: ''
		};

		// keypad settings
		$scope.vm = this;

		$scope.onKeyPressed = function(data) {
      if (data == '<') {
          $scope.move.startZip = $scope.move.startZip.slice(0, $scope.move.startZip.length - 1);
      } else {
          $scope.move.startZip += data;
      }
    };

		$scope.onKeyPressedDest = function(data) {
      if (data == '<') {
          $scope.move.destinationZip = $scope.move.destinationZip.slice(0, $scope.move.destinationZip.length - 1);
      } else {
          $scope.move.destinationZip += data;
      }
    };

    $scope.vm.valor = '';
    $scope.vm.keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		$scope.vm.onKeyPressed = $scope.onKeyPressed;
		$scope.vm.onKeyPressedDest = $scope.onKeyPressedDest;

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
