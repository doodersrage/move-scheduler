'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Move = mongoose.model('Move'),
	_ = require('lodash'),
	distance = require('google-distance');

// assign Google API key
distance.apiKey = 'AIzaSyCRQvz2CrFoDjcYul3vm8ZiAYqRzUCCVtc';

/**
 * Create a Move
 */
exports.create = function(req, res) {
	var move = new Move(req.body);
	move.user = req.user;

	move.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(move);
		}
	});
};

/**
 * Show the current Move
 */
exports.read = function(req, res) {
	res.jsonp(req.move);
};

/**
 * Update a Move
 */
exports.update = function(req, res) {
	var move = req.move ;

	move = _.extend(move , req.body);

	move.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(move);
		}
	});
};

/**
 * Delete an Move
 */
exports.delete = function(req, res) {
	var move = req.move ;

	move.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(move);
		}
	});
};

/**
 * List of Moves
 */
exports.list = function(req, res) { Move.find().sort('-created').populate('user', 'displayName').exec(function(err, moves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moves);
		}
	});
};

/**
 * Move middleware
 */
exports.moveByID = function(req, res, next, id) { Move.findById(id).populate('user', 'displayName').exec(function(err, move) {
		if (err) return next(err);
		if (! move) return next(new Error('Failed to load Move ' + id));
		req.move = move ;
		next();
	});
};

/**
 * Move authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.move.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

// custom moving app methods
// get starting location info
exports.getStartInfo = function(req, res, next){

	distance.get(
  {
    origin: '23220',
    destination: req.body.destZip
  },
  function(err, data) {
    if (err) return console.log(err);
		// return found data
		res.jsonp(data);
	});

};
// get destination location info
exports.getDestinationInfo = function(req, res, next){

	distance.get(
  {
    origin: req.body.startZip,
    destination: req.body.destZip
  },
  function(err, data) {
    if (err) return console.log(err);
		// return found data
		res.jsonp(data);
	});

};
