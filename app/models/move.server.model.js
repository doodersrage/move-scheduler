'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Move Schema
 */
var MoveSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Move name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Move', MoveSchema);