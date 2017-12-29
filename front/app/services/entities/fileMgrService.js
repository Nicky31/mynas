import EntityManager from './lib/EntityManager';
import fileModel from './models/fileModel';

fileMgrService.$inject = ['fileApiService'];
function fileMgrService(fileApiService) {
	return new EntityManager(fileModel,
	{
		fetchOne: ({id}) => {
			// return fileApiService.getProfile(id)
		},

		fetchAll: () => {
			// return fileApiService.fetchAllFiles()
		},

		update: entity => {

		},

		insert: entity => {

		},

		delete: id => {
			return fileApiService.deleteFiles(id).then(ret => ({success: true, ...ret}))
		}
	},
	{
		findFiles: function(path) {
			return fileApiService.fetchAllFiles(path)
			.then(ret => {
				if (ret && ret.success) {
					ret.entity = this.worker.append(ret.entity)
					return ret
				}
				throw ret
			})
		},

		upload: function(file, path) {
			return fileApiService.singleUpload(file, path)
			.then(ret => {
				if (ret.success) {
					ret.entity = this.worker.append(ret.entity)
					return ret
				}
				throw ret
			})
		},

		createFolder: function(name, path) {
			return fileApiService.createFolder(name, path)
			.then(ret => {
				if (ret.success) {
					ret.entity = this.worker.append(ret.entity)
					return ret
				}
				throw ret
			})
		}
	});
}

export default fileMgrService;