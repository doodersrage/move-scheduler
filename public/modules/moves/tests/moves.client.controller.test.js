'use strict';

(function() {
	// Moves Controller Spec
	describe('Moves Controller Tests', function() {
		// Initialize global variables
		var MovesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Moves controller.
			MovesController = $controller('MovesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Move object fetched from XHR', inject(function(Moves) {
			// Create sample Move using the Moves service
			var sampleMove = new Moves({
				name: 'New Move'
			});

			// Create a sample Moves array that includes the new Move
			var sampleMoves = [sampleMove];

			// Set GET response
			$httpBackend.expectGET('moves').respond(sampleMoves);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.moves).toEqualData(sampleMoves);
		}));

		it('$scope.findOne() should create an array with one Move object fetched from XHR using a moveId URL parameter', inject(function(Moves) {
			// Define a sample Move object
			var sampleMove = new Moves({
				name: 'New Move'
			});

			// Set the URL parameter
			$stateParams.moveId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/moves\/([0-9a-fA-F]{24})$/).respond(sampleMove);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.move).toEqualData(sampleMove);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Moves) {
			// Create a sample Move object
			var sampleMovePostData = new Moves({
				name: 'New Move'
			});

			// Create a sample Move response
			var sampleMoveResponse = new Moves({
				_id: '525cf20451979dea2c000001',
				name: 'New Move'
			});

			// Fixture mock form input values
			scope.name = 'New Move';

			// Set POST response
			$httpBackend.expectPOST('moves', sampleMovePostData).respond(sampleMoveResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Move was created
			expect($location.path()).toBe('/moves/' + sampleMoveResponse._id);
		}));

		it('$scope.update() should update a valid Move', inject(function(Moves) {
			// Define a sample Move put data
			var sampleMovePutData = new Moves({
				_id: '525cf20451979dea2c000001',
				name: 'New Move'
			});

			// Mock Move in scope
			scope.move = sampleMovePutData;

			// Set PUT response
			$httpBackend.expectPUT(/moves\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/moves/' + sampleMovePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid moveId and remove the Move from the scope', inject(function(Moves) {
			// Create new Move object
			var sampleMove = new Moves({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Moves array and include the Move
			scope.moves = [sampleMove];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/moves\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMove);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.moves.length).toBe(0);
		}));
	});
}());