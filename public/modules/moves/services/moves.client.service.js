'use strict';

//Moves service used to communicate Moves REST endpoints
angular.module('moves').factory('Moves', ['$resource',
	function($resource) {
		return $resource('moves/:moveId', { moveId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);