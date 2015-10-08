'use strict';

// Moves controller
angular.module('moves').controller('MovesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moves', '$state',
	function($scope, $stateParams, $location, Authentication, Moves, $state ) {
		$scope.authentication = Authentication;

		// controller vars
		$scope.host = $location.host() + ':' + $location.port();
		$scope.hourRate = 129;
		// init new move object
		$scope.move = {
			email: '',
			selDate: new Date(),
			moveType: '',
			startZip: '',
			destinationZip: '',
			destinationAddressDistance: '',
			stopAlongWay: 0,
			appliances: {
				'Washer/Dryer':false,
				'Refrigerator':false,
				'Garage fridge or freezer':false,
				'other':false
			},
			attic: '',
			basement: '',
			bigStuff: '',
			deliveryAccess: '',
			deliveryAccessDif: 0,
			deliveryAddressDistance: '',
			disassembly: {
				'Ikea bed':false,
				'bunk beds':false,
				'cribs':false,
				'washer/dryer hookup':false,
				'other':false
			},
			garage: '',
			movingToType: '',
			patioFurniture: '',
			shed: '',
			tobemoved: '',
			primaryAccess: '',
			primaryAccessDif: 0,
			roomsMoving: 0
		};
		// move times
		$scope.times = {
			mins: 0,
			hours: 0
		};

		var money_round = function(num) {
		    return Math.ceil(num * 100) / 100;
		};

		// keypad settings
		$scope.vm = this;

		$scope.onKeyPressed = function(data) {
      if (data === '<') {
          $scope.move.startZip = $scope.move.startZip.slice(0, $scope.move.startZip.length - 1);
      } else {
          $scope.move.startZip += data;
      }
    };

		$scope.onKeyPressedDest = function(data) {
      if (data === '<') {
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
					email: $scope.move.email,
					selDate: $scope.move.selDate,
					moveType: $scope.move.moveType,
					startZip: $scope.move.startZip,
					destinationZip: $scope.move.destinationZip,
					destinationAddressDistance: $scope.move.destinationAddressDistance,
					stopAlongWay: $scope.move.stopAlongWay,
					appliances: $scope.move.appliances,
					attic: $scope.move.attic,
					basement: $scope.move.basement,
					bigStuff: $scope.move.bigStuff,
					deliveryAccess: $scope.move.deliveryAccess,
					deliveryAccessDif: $scope.move.deliveryAccessDif,
					deliveryAddressDistance: $scope.move.deliveryAddressDistance,
					disassembly: $scope.move.disassembly,
					garage: $scope.move.garage,
					movingToType: $scope.move.movingToType,
					patioFurniture: $scope.move.patioFurniture,
					shed: $scope.move.shed,
					tobemoved: $scope.move.tobemoved,
					primaryAccess: $scope.move.primaryAccess,
					primaryAccessDif: $scope.move.primaryAccessDif,
					roomsMoving: $scope.move.roomsMoving
			});

			// Redirect after save
			move.$save(function(response) {
				//$location.path('moves/' + response._id);

				// load newly saved move
				$scope.move = Moves.get({
					moveId: response._id
				});

				// send user to saved slide
				$state.go('setupMove.progressSaved');

				// // Clear form fields
				// $scope.name = '';
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

			//$state.go('setupMove.first');
		};

		// reload existing move
		$scope.loadMove = function(){
			if($stateParams.id){
				$scope.move = Moves.get({
					moveId: $stateParams.id
				});
			}
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

		// delay redirect to specified state
		$scope.delayRedirect = function(seconds,state){
			setTimeout($state.go(state), (Number(seconds) * 10000));
		};

		// print disassembly list
		$scope.printDisList = function(){
			var selDis = [];
			var selDisFin = '';

			angular.forEach($scope.move.disassembly, function(value, key) {
				if(value === true){
					selDis.push(key);
				}
			});

			// get last selected item
			if(selDis.length > 1){
				selDisFin = selDis.pop();
			}

			if(selDis.length > 0){
				if(selDisFin) {
					return selDis.join(', ') + ' and ' + selDisFin;
				} else {
					return selDis.join();
				}
			} else {
				return 'nothing';
			}
		};

		$scope.calcCostEst = function(){
			return money_round(($scope.hourRate * $scope.times.hours));
		};

		// calc move time
		$scope.calcMoveTime = function(){

			// reset counts
			$scope.times.mins = 0;
			$scope.times.hours = 0;
			var roomsMins = 0;

			// walk through move vals
			angular.forEach($scope.move, function(value, key) {

				// apply each calc per variable instance
				// move type assign
				if(key === 'moveType'){
					switch(value){
						case 'xsmall':
							$scope.times.mins += 90;
						break;
						case 'small':
							$scope.times.mins += 150;
						break;
						case 'medium':
							$scope.times.mins += 210;
						break;
						case 'large':
							$scope.times.mins += 300;
							$scope.hourRate = 145;
						break;
					}
				}
				// calc for rooms
				if(key === 'roomsMoving'){
					roomsMins += (Number(value) * 60);
					$scope.times.mins += roomsMins;
				}
				// calc appliance move
				if(key === 'appliances'){
					angular.forEach(value, function(appliance, appKey) {
						switch(appKey){
							case 'Refrigerator':
							case 'Washer/Dryer':
								if(appliance === true){
									$scope.times.mins += 20;
								}
							break;
							case 'Garage fridge or freezer':
								if(appliance === true){
									$scope.times.mins += 5;
								}
							break;
							case 'other':
								if(appliance === true){
									$scope.times.mins += 10;
								}
							break;
						}
					});
				}

				// calc attic move
				if(key === 'attic'){
					switch(value){
						case 'A few things':
							$scope.times.mins += 20;
						break;
						case 'The usual boxes bins and such':
							$scope.times.mins += 40;
						break;
						case 'A good amount of stuff':
							$scope.times.mins += 60;
						break;
						case 'I\'m afraid to look':
							$scope.times.mins += 90;
						break;
					}
				}

				// calc basement move
				if(key === 'basement'){
					switch(value){
						case 'A few things':
							$scope.times.mins += 20;
						break;
						case 'The usual boxes bins and such':
							$scope.times.mins += 40;
						break;
						case 'A good amount of stuff':
							$scope.times.mins += 60;
						break;
						case 'I\'m afraid to look':
							$scope.times.mins += 90;
						break;
					}
				}

				// calc garage move
				if(key === 'garage'){
					switch(value){
						case 'light garage stuff':
							$scope.times.mins += 20;
						break;
						case 'garage stuff and some boxes':
							$scope.times.mins += 40;
						break;
						case 'Garage stuff, boxes plus bikes and toys':
							$scope.times.mins += 60;
						break;
						case 'Its full. No room for the car':
							$scope.times.mins += 90;
						break;
					}
				}

				// calc shed move
				if(key === 'shed'){
					switch(value){
						case 'light yard stuff':
							$scope.times.mins += 20;
						break;
						case 'yard stuff and some storage':
							$scope.times.mins += 40;
						break;
						case 'yard stuff, boxes plus bikes and toys':
							$scope.times.mins += 60;
						break;
						case 'Its full. bikes lawnmowers, ladders and canoes':
							$scope.times.mins += 90;
						break;
					}
				}

				// calc patio furniture move
				if(key === 'patioFurniture'){
					switch(value){
						case 'Grill and patio furniture':
							$scope.times.mins += 30;
						break;
						case 'Grill, patio furniture, bird bath, chiminea etc':
							$scope.times.mins += 60;
						break;
					}
				}

				// calc hours on final loop
				$scope.times.hours = money_round(($scope.times.mins / 60));

			});

		};

	}
]);
