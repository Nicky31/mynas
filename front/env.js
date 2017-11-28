'use strict';

const path = require('path');

module.exports = ({ 
	PATH: {
		APP: path.join(__dirname, 'app'),
		APP_PUBLIC: path.join(__dirname, 'app', 'public')
	},

	SERVER: {
		PORT: 2000
	}
});