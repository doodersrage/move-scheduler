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
	email: {
		type: String,
		default: '',
		required: 'Please fill Move email',
		trim: true
	},
	selTimeDay: {
		type: String,
		default: '',
		trim: true
	},
	selDate: {
		type: Date,
		default: new Date()
	},
	moveType: {
		type: String,
		default: '',
		trim: true
	},
	startZip: {
		type: String,
		default: '',
		trim: true
	},
	startInfo: {
		type: String,
		default: '',
		trim: true
	},
	destinationZip: {
		type: String,
		default: '',
		trim: true
	},
	destinationInfo: {
		type: String,
		default: '',
		trim: true
	},
	destinationAddressDistance: {
		type: String,
		default: '',
		trim: true
	},
	stopAlongWay: {
		type: Number,
		default: 0
	},
	appliances: {
		type: String,
		default: '',
		trim: true
	},
	attic:{
		type: String,
		default: '',
		trim: true
	},
	basement: {
		type: String,
		default: '',
		trim: true
	},
	bigStuff: {
		type: String,
		default: '',
		trim: true
	},
	deliveryAccess: {
		type: String,
		default: '',
		trim: true
	},
	deliveryAccessDif: {
		type: Number,
		default: 0
	},
	deliveryAddressDistance: {
		type: String,
		default: '',
		trim: true
	},
	disassembly: {
		type: String,
		default: '',
		trim: true
	},
	garage: {
		type: String,
		default: '',
		trim: true
	},
	movingToType: {
		type: String,
		default: '',
		trim: true
	},
	patioFurniture: {
		type: String,
		default: '',
		trim: true
	},
	shed: {
		type: String,
		default: '',
		trim: true
	},
	tobemoved: {
		type: String,
		default: '',
		trim: true
	},
	primaryAccess: {
		type: String,
		default: '',
		trim: true
	},
	primaryAccessDif: {
		type: Number,
		default: 0
	},
	roomsMoving: {
		type: Number,
		default: 0
	},
	costsData: {
		type: Object
	},
	times: {
		type: Object
	},
	contact: {
		type: Object
	},
	booked: {
		type: Boolean,
		default: false
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
