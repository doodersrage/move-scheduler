'use strict';

var googAPI = 'AIzaSyCRQvz2CrFoDjcYul3vm8ZiAYqRzUCCVtc';

var geocoderProvider = 'google';
var httpAdapter = 'https';
// optionnal
var extra = {
    apiKey: googAPI, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Move = mongoose.model('Move'),
	_ = require('lodash'),
	distance = require('google-distance'),
	config = require('../../config/config'),
	nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport'),
	async = require('async'),
	moment = require('moment'),
	geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

// assign Google API key
distance.apiKey = googAPI;

// round money vars
var money_round = function(num) {
		return Math.ceil(num * 100) / 100;
};

// generate save and update user move email
var sendMoveEmail = function(req, res, move){

	// gen vars
	var destText;
	var selectedDate = moment(move.selDate).format('MM/DD/YYYY');
	var selectedTime = moment(move.selDate).format('h:mm a');
	var estCost = money_round((move.costsData.hourRate * move.costsData.times.hours));
	if(move.destinationZip){
		destText = move.destinationInfo.destination;
	} else {
		destText = move.destinationAddressDistance + ' minutes away';
	}

	// send email
	async.waterfall([
		function(done) {
			res.render('templates/move-request-email', {
				move: move,
				selectedDate: selectedDate,
				selectedTime: selectedTime,
				estCost: estCost,
				destText: destText,
				url: 'http://' + req.headers.host + '/moves/' + move._id
			}, function(err, emailHTML) {
				done(err, emailHTML);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, done) {
			var smtpTransport = nodemailer.createTransport(sgTransport(config.mailer.options));
			var mailOptions = {
				to:[move.email, config.mailer.from],
				from: config.mailer.from,
				subject: 'New Move Request',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				done(err);
			});
		}
	], function(err) {
		//if (err) return next(err);
	});

};

exports.geoLookup = function(req, res){

	geocoder.reverse({lat: req.body.lat, lon: req.body.lon}, function(err, geoData) {
    //console.log(res);
		res.jsonp(geoData);
	});

};

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

			// send move email
			sendMoveEmail(req, res, move);

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

			// send move email
			sendMoveEmail(req, res, move);

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

	if(req.body.destZip){
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
	}

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
