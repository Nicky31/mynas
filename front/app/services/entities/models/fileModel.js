'use strict';

import EntityModel from '../lib/EntityModel';
import moment from 'moment'

function getMimeFaClass(mime) {
	const faClassName = name => ('fa fa-file-' + name)
	if (mime == 'application/zip' || mime == 'application/x-rar-compressed')
		return faClassName('archive-o')
	if (mime == 'application/pdf')
		return faClassName('pdf-o')
	mime = mime.split('/')
	if (mime[0] == 'audio')
		return faClassName('audio-o')
	if (mime[0] == 'image')
		return faClassName('image-o')
	return faClassName('o')
}

const config = {
	updateCallbacks: {
		updatedAt: function(updatedAt) {
			const iso = new Date(updatedAt).toISOString()
			this.humanUpdatedAt = moment(iso).fromNow()
		},

		mime: function(mime) {
			this.mimeFaClassName = getMimeFaClass(mime)
		}
	},

	helpers: {

	}
}

export default new EntityModel('File', {
	id: {},

	filename: {},

	filepath: {},

	folderId: {},
	
	mime: {},

	size: {},

	updatedAt: {}

}, config);