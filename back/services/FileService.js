import fs from 'fs'
import config from '../config';
import { ObjectId } from 'mongodb'

export const MIME_DIRECTORY = 'directory'

function FileService({Files, FileLocations}) {

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

	this.findOneFile = async (query, user) => {
		query.ownerId = user.id || user._id
		return await Files.findOne(query)
	}

	this.locateFiles = async (search, user) => { // query must contain path / filename
		var query = {ownerId: user._id}
		if (typeof search.directory != 'undefined') {
			query.directory = search.directory
		}
		if (search.filename) { // Find specific file
			return await FileLocations.findOne({...query, path: search.path, filename: search.filename})
		}
		// Find first depth files
		if (!search.recursive) {
			query.path = search.path
			return await FileLocations.find(query)
		} 
		return await FileLocations.aggregate({
			$addFields: {"root": {$slice: ["$arr", 0, search.path.length]}}
		}, {
			$match: {"root": search.path, ...query}
		})
	},

	this.fileExists = async (filename, path, user, directory) => {
		if (!path) {
			throw new Error(`Path required`)
		}
		if (path.length > 1) {
			const parent = await this.locateFiles({path: path.slice(0, -1), filename: path[path.length - 1], directory: true}, user)
			if (!parent)
				throw new Error(`Directory ${path} doesn't exist !`			)
		} else if (path.length < 1 || path[0] != '/') {
			throw new Error(`Root directory must be '/' !`)
		}
		var query = {filename, path}
		if (typeof directory != 'undefined') {
			query.directory = directory
		}
		return this.locateFiles(query, user)		
	},

	this.setNewLocation = async (loc, user) => {
		const data = {
			fileId: loc.fileId,
			path: loc.path,
			filename: loc.filename,
			directory: loc.directory == true,
			ownerId: user._id
		}
		const response = await FileLocations.insert(data)
		return Object.assign({id: response.insertedIds[0]}, data)
	},

	this.createFile = async (data, owner) => {
		if (data.path && !Array.isArray(data.path)) {
			data.path = [data.path]
		}
		if (await this.fileExists(data.filename, data.path, owner, data.directory == true)) {
			throw new Error(data.path.join('/') + '/' + data.filename + " is already existant !")
		}

		data.updatedAt = new Date()
		data.realPath = data.directory ? '' : this.getNewFilePath(data.filename)
		data.ownerId = owner.id || owner._id
		if (typeof data.directory == 'undefined')
			data.directory = false
		const response = await Files.insert(data)
		const file = Object.assign({id: response.insertedIds[0]}, data)

		const location = await this.setNewLocation({fileId: file.id, path: data.path, filename: data.filename, directory: data.directory == true}, owner)
		file.userPath = location.path
		file.filename = location.filename

		return file
	}

	this.createFolder = async (data, owner) => {
		return this.createFile({mime: MIME_DIRECTORY, size: 0, path: data.path, filename: data.name, directory: true}, owner)
	}

	this.deleteFiles = async (fileIds, user) => {
		const query = {_id: {"$in": fileIds.map(id => new ObjectId(id))}}
		const files = await this.findFiles(query, user)
		if (!files || !files.length) {
			throw new Error("Unable to delete files " + fileIds + " !")
		}

		FileLocations.deleteMany({fileId: query._id})
		return Files.deleteMany(query)
		.then(ret => {
			files.forEach(file => {
				if (!file.directory)
					fs.unlinkSync(file.realPath)
			})
		})
	}
}

export default FileService