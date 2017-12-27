import fs from 'fs'
import config from '../config';

export const MIME_DIRECTORY = 'directory'

function FileService({Files}) {

	this.getNewFilePath = (filename) => {
		const dotIdx = filename.lastIndexOf('.')
		const ext = (dotIdx != -1 && dotIdx < (filename.length - 1)) ? filename.substring(dotIdx) : ''

		var path = ''
		do {
			var random = (Math.random().toString(36) + Math.random().toString(36)).replace('\.', '')
			path = config.upload_folder + random + ext
		} while (fs.existsSync(path))
		return path
	}

	this.findFiles = async (query, user) => {
		query.ownerId = user.id || user._id
		return await Files.find(query).toArray()
	}

	this.createFile = async (data, owner) => {
		if (data.folderId) {
			const check = await this.findFiles({id: data.folderId, mime: MIME_DIRECTORY})
			if (!check.length)
				throw "Unable to found folderId " + data.folderId + " !"
		}
		data.updatedAt = new Date()
		data.filepath = data.mime != MIME_DIRECTORY ? this.getNewFilePath(data.filename) : '/'
		data.ownerId = owner.id || owner._id
		const response = await Files.insert(data)
		return Object.assign({id: response.insertedIds[0]}, data)
	}

	this.createFolder = async (data, owner) => {
		data.mime = MIME_DIRECTORY
		return this.createFile(data)
	}
}

export default FileService