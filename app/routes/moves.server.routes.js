'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var moves = require('../../app/controllers/moves');

	// Moves Routes
	app.route('/moves')
		.get(moves.list)
		.post(moves.create);

	app.route('/moves/:moveId')
		.get(moves.read)
		.put(moves.update)
		.delete(users.requiresLogin, moves.hasAuthorization, moves.delete);

	// Finish by binding the Move middleware
	app.param('moveId', moves.moveByID);
};
