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
			return fileApiService.fetchAllFiles()
		},

		update: entity => {

		},

		insert: entity => {

		},

		delete: id => {

		}
	},
	{
		upload: function(file) {
			return fileApiService.singleUpload(file)
			.then(ret => {
				if (ret.success) {
					ret.entity = this.worker.append(ret.entity)
				}
				return ret
			})
		}
	});
}

export default fileMgrService;