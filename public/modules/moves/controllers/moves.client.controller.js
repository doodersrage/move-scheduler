'use strict';

// Moves controller
angular.module('moves').controller('MovesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moves', '$state', '$http',
	function($scope, $stateParams, $location, Authentication, Moves, $state, $http ) {
		$scope.authentication = Authentication;

		// controller vars
		$scope.host = $location.host() + ':' + $location.port();
		$scope.message = '';
		$scope.hourRate = 129;
		$scope.dateAvail = false;
		$scope.dateInvalid = false;
		$scope.checkingCal = false;
		// init new move object
		$scope.move = {
			email: '',
			selTimeDay: 'morning',
			selDate: new Date(),
			moveType: '',
			startZip: '',
			startInfo: {},
			destinationZip: '',
			destinationAddressDistance: 0,
			destinationInfo: {},
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
			deliveryAddressDistance: 0,
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
			roomsMoving: 0,
			costsData: {}
		};
		// move times
		$scope.times = {
			startTravelMins: 0,
			destTravelMins: 0,
			mins: 0,
			hours: 0
		};

		var money_round = function(num) {
		    return Math.ceil(num * 100) / 100;
		};

		// ui bootstrap date values
		$scope.minDate = new Date();
		$scope.events = [];
		$scope.getDayClass = function(date, mode) {
	    if (mode === 'day') {
	      var dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (var i=0;i<$scope.events.length;i++){
	        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return $scope.events[i].status;
	        }
	      }
	    }
			return '';
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

		$scope.useMyLocation = function(){

			if (navigator.geolocation) {
				$scope.message = 'Looking up your location. Please be patient.';
				$scope.lookingup = 1;
				navigator.geolocation.getCurrentPosition(function(position){
		      $scope.$apply(function(){
		        $scope.geoPosition = position;

						// lookup geo data
						$http.post('/moves/geoLookup', {
					        lat: $scope.geoPosition.coords.latitude,
									lon: $scope.geoPosition.coords.longitude
				    }).
						success(function(data, status, headers, config) {
							$scope.lookingup = 0;
							$scope.move.startZip = data[0].zipcode;

							$scope.getStartInfo();

						});

		      });
		    });
      }
      else {
				$scope.lookingup = 1;
        $scope.message = 'Geolocation is not supported by this browser.';
      }

		};

		// check selected date and time for available options
		$scope.checkDate = function(){

			if($scope.move.selDate){

				if($scope.move.selDate > new Date()){

					$scope.checkingCal = true;

					$scope.dateInvalid = false;

					// convert selected date and time
					var usrSelDateTime = new Date($scope.move.selDate);

					// reset selected date hours based on selected date part
					usrSelDateTime.setMinutes(0);
					usrSelDateTime.setSeconds(0);
					if($scope.move.selTimeDay === 'morning'){
						usrSelDateTime.setHours(9);
					} else {
						usrSelDateTime.setHours(13);
					}

					// lookup geo data
					$http.post('/moves/checkCalendar', {
								selDate: usrSelDateTime
					}).
					success(function(data, status, headers, config) {
						if(data.status === 'Error'){
							$scope.message = data.status + 'determining assigned moving data. Please try again shortly.';
							$scope.dateAvail = false;
						} else if(data.status === 'No upcoming events found.') {
							$scope.message = '';
							$scope.dateAvail = true;
						} else if(data.status === 'unavailable') {
							$scope.message = 'Sorry, no moving slots are available during your selected time.';
							$scope.dateAvail = false;
						} else if(data.status === 'open') {
							$scope.message = '';
							$scope.dateAvail = true;
						}

						$scope.checkingCal = false;

					});

				} else {
					$scope.message = 'You have chosen a previous date and time. Please choose a date and time in the future.';
					$scope.dateAvail = false;
					$scope.dateInvalid = true;

				}

			}

		};

		// Create new Move
		$scope.create = function() {

			// validate submitted email address
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			if(re.test($scope.move.email) === false){
				$scope.message = 'Please enter a valid email address.';
			} else {

				$scope.message = '';

				var move;

				// append move time and costs calc to move object
				$scope.move.costsData.hourRate = $scope.hourRate;

				$scope.move.costsData.times = $scope.times;

				// Create new Move object
				if(typeof $scope.move._id === 'undefined'){

					move = new Moves($scope.move);

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

				// update existing move
				} else {
					move = $scope.move ;

					move.$update(function() {
						$location.path('moves/' + move._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}

			}
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

		$scope.getDestText = function(){

			if($scope.move.destinationZip){
				return $scope.move.destinationInfo.destination;
			} else {
				return $scope.move.destinationAddressDistance + ' minutes away';
			}

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
						case 'small':
						case 'medium':
							$scope.hourRate = 129;
						break;
						case 'large':
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

		// calc moving info
		// get staring info
		$scope.getStartInfo = function(){

			$http.post('/moves/getStartInfo', {
		        destZip: $scope.move.startZip
	    }).
			success(function(data, status, headers, config) {
				$scope.move.startInfo = data;
				$scope.times.startTravelMins = (data.durationValue / 60);
			});

		};
		// get destination info
		$scope.getDestinationInfo = function(){

			$http.post('/moves/getDestinationInfo', {
				startZip: $scope.move.startZip,
        destZip: $scope.move.destinationZip
	    }).
			success(function(data, status, headers, config) {
				$scope.move.destinationInfo = data;
				$scope.times.destTravelMins = (data.durationValue / 60);
			});

		};

	}
]);
