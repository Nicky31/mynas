import EntityManager from './lib/EntityManager';
import fileModel from './models/fileModel';

fileMgrService.$inject = ['fileApiService'];
function fileMgrService(fileApiService) {
	return new EntityManager(fileModel,
	{
		Delete: {
			params: ['id'],
			handler: function(id) {
				return fileApiService.deleteFiles(id).then(() => this.task('DeleteEntity', id))
			}
		},

		ReadDir: {
			params: ['path'],
			handler: function(path) {
				return fileApiService.fetchAllFiles(path).then(ret => this.task('InsertEntity', ret.result))
			}
		},

		Upload: {
			params: ['file', 'path'],
			handler: function(file, path) {
				return fileApiService.singleUpload(file, path).then(ret => this.task('InsertEntity', ret.result))
			}
		},

		CreateFolder: {
			params: ['name', 'path'],
			handler: function(name, path) {
				return fileApiService.createFolder(name, path).then(ret => this.task('InsertEntity', ret.result))
			}
		}
	})
}

export default fileMgrService


