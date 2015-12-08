'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var moves = require('../../app/controllers/moves');

	// Moves Routes
	app.route('/moves')
		.get(moves.list)
		.post(moves.create);

	// check users calendar for open spots
	app.route('/moves/checkCalendar')
		.post(moves.checkCalendar);

	// book move for user
	app.route('/moves/bookMove')
		.post(moves.bookMove);

	// STD CRUD ops
	app.route('/moves/:moveId')
		.get(moves.read)
		.put(moves.update)
		.delete(users.requiresLogin, moves.hasAuthorization, moves.delete);

// gather Google Maps location info
	app.route('/moves/getStartInfo')
			.post(moves.getStartInfo);
	app.route('/moves/getDestinationInfo')
			.post(moves.getDestinationInfo);

// geo lookup
app.route('/moves/geoLookup')
		.post(moves.geoLookup);

	// Finish by binding the Move middleware
	app.param('moveId', moves.moveByID);
};
