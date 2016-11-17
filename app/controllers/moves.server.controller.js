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
var sendMoveEmail = function(req, res, move, moveID){

	// gen vars
	var destText, hoursOp, contactStr;
	var selectedDate = moment(move.selDate).format('MM/DD/YYYY');
	var selectedTime = moment(move.selDate).format('h:mm a');
  // set estimate cost
	var estCost = money_round((move.costsData.hourRate * move.costsData.times.hours) + (move.costsData.fuelFee ? move.costsData.fuelFee : 0));
  // set destination text
	if(move.destinationZip){
		destText = move.destinationInfo.destination;
	} else {
		destText = move.destinationAddressDistance + ' minutes away';
	}

  // gen hours output
  if(move.times.hours > 1){
    hoursOp = (move.times.hours - 1) + '-' + move.times.hours;
  } else {
    hoursOp = move.times.hours;
  }

  // gen customer contact info string
  if(move.contact.firstName && move.contact.lastName){
    contactStr = '<p>' + move.contact.firstName + ' ' + move.contact.lastName + '<br>';
    contactStr += move.contact.phone + '<br>';
    contactStr += move.contact.email + '<br>';
    contactStr += move.contact.address + '<br>';
    if(move.contact.address2 !== '') {
      contactStr += move.contact.address2 + '<br>';
    }
    contactStr += move.contact.city + ', ' + move.contact.state  + ' ' + move.contact.zip + '</p>';
  }

	// send email
	async.waterfall([
		function(done) {
			res.render('templates/move-request-email', {
				move: move,
				selectedDate: selectedDate,
				selectedTime: selectedTime,
        estCostMin: money_round((estCost-130)),
        estCost: estCost,
				destText: destText,
        hoursOp: hoursOp,
        moveID: moveID,
        contactStr: contactStr,
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
  var msg;

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
  var results = {};
  // set upper bounds of search query
  var startDate = moment(req.body.selDate);
  // reset end date hours +8
  var endDate = moment(req.body.selDate);
  endDate.add(4, 'hours');
  // query google calendar
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    maxResults: 24,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      results.error = err;
      results.status = 'Error';
      return res.jsonp(results);
    }
    var events = response.items;
    if (events.length === 0) {
      results.status = 'No upcoming events found.';
      return res.jsonp(results);
    } else {
      var totEventsTime = 0;
      var overSixHrs = 0;
      var curDif, now, then, start, event, end, curTime;
      // walk through found objects, gather overall event timings
      for (var i = 0; i < events.length; i++) {
        event = events[i];
        start = event.start.dateTime || event.start.date;
        end = event.end.dateTime || event.end.date;
        // gather total time alloted
        // store current event start and end times
        now = moment(end);
        then = moment(start);
        // get time vals dif
        curDif = moment.duration(now.diff(then));
        // calc cur event time
        curTime = (curDif.get('hours') * 60) + curDif.get('minutes');
        if(curTime >= 360){
          overSixHrs += 1;
        }
        // store total time calculated
        totEventsTime += curTime;

        if((events.length - 1) === i){
          // assign result values
          results.totTime = totEventsTime;
          results.overSixHrs = overSixHrs;
          if((totEventsTime / 60) > 8) {
            results.status = 'unavailable';
          } else {
            results.status = 'open';
          }
        }
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

	geocoder.reverse(
    {
      lat: req.body.lat,
      lon: req.body.lon
    }, function(err, geoData) {
    //console.log(res);
		res.jsonp(geoData);
	});

};

/**
 * Create a Move
 */
exports.create = function(req, res) {
	var move = new Move(req.body);
  var moveExt = req.body;
	move.user = req.user;

	move.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			// send move email
			sendMoveEmail(req, res, moveExt, String(move._id));

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

// book move to calendar and save to database
exports.bookMove = function(req, res){

  // create local var for move data
  var move = new Move(req.body.move);

  // update booked Boolean
  move.booked = true;

  // add move to calendar
  // client still deciding

  // save move object to db
  move.save(function(err) {
		if (err) {
      console.log(err);
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
