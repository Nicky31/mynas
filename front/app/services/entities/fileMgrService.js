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

	});
}

export default fileMgrService;