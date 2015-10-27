'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  readline = require('readline'),
  google = require('googleapis'),
  googleAuth = require('google-auth-library'),
	errorHandler = require('./errors'),
	Move = mongoose.model('Move'),
	_ = require('lodash'),
	distance = require('google-distance'),
	config = require('../../config/config'),
	nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport'),
	async = require('async'),
	moment = require('moment');

// geo code config
var googAPI = config.google.apiKey;

var geocoderProvider = 'google';
var httpAdapter = 'https';
// optionnal
var extra = {
    apiKey: googAPI, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var	geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

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

// gather and compare google calendar data
var TOKEN_PATH = config.google.TOKEN_DIR + 'calendar-nodejs-quickstart.json';

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(config.google.TOKEN_DIR);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(req, res, credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      //getNewToken(oauth2Client, callback);
      msg = 'Google API link failed. Please reconnect to API console.';
      return res.jsonp(msg);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(req, res, oauth2Client);
    }
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(req, res, auth) {
  var msg;
  // set upper bounds of search query
  var startDate = new Date(req.body.selDate);
  var endDate = startDate;
  endDate.setHours(endDate.getHours()+1);
  // query google calendar
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      msg = 'The API returned an error: ' + err;
      return res.jsonp(msg);
    }
    var events = response.items;
    if (events.length === 0) {
      msg = 'No upcoming events found.';
      return res.jsonp(msg);
    } else {
      var results = [];
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        results.push('%s - %s', start, event.summary);
      }
      return res.jsonp(results);
    }
  });
}

exports.checkCalendar = function(req, res){

  var appDir = path.dirname(require.main.filename);

  // Load client secrets from a local file.
  fs.readFile(appDir + '/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(req, res, JSON.parse(content), listEvents);
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
