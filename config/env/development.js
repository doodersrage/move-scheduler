'use strict';

module.exports = {
	db: 'mongodb://localhost/moxie-movers-dev',
	app: {
		title: 'Moxie Movers - Development Environment'
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
