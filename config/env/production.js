'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/moxie-movers',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/ngKeypad/dist/ng-keypad.min.css'
		],
			js: [
				'public/lib/moment/min/moment.min.js',
				'public/lib/moment/min/locals.js',
				'public/lib/humanize-duration/humanize-duration.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/angular-timer/dist/angular-timer.min.js',
				'public/lib/ngKeypad/dist/ng-keypad.min.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3001/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/google/callback',
		apiKey: 'AIzaSyCRQvz2CrFoDjcYul3vm8ZiAYqRzUCCVtc',
		SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],
		TOKEN_DIR: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
		successCode: '4/4kSZY-WMYk-fwlB_FOU8T5qH2F4NkwlVblNs94LOGhs'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'moxiemovers@gmail.com',
		options: {
		    auth: {
		        api_key: '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'
		    }
		}
	}
};
