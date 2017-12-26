import moment from 'moment'

function FileService({Files}) {

	this.getFilesIn = async (folderId) => {
		var query = folderId ? {folderId} : undefined
		return await Files.find(query).toArray()
	}

	this.createFile = async (data) => {
		data.updatedAt = moment().toISOString()
		const response = await Files.insert(data)
		return Object.assign({id: response.insertedIds[0]}, data)
	}

	this.createFolder = async (data) => {
		data.mime = 'folder'
		return this.createFile(data)
	}
}

export default FileService