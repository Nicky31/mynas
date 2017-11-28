import EntityManager from './lib/EntityManager';
import userModel from './models/userModel';

userMgrService.$inject = ['userApiService'];

function userMgrService(userApiService) {
	return new EntityManager(userModel,
	{
		fetchOne: ({id}) => {
			// return userApiService.getProfile(id)
		},

		fetchAll: () => {

		},

		update: entity => {

		},

		insert: entity => {

		},

		delete: id => {

		}
	},
	{
		login: function (user, pwd) {
			return userApiService.login(user, pwd)
			.then(ret => {
				if (ret.success) {
					ret.entity = ret.entity.user;
					ret.entity = this.worker.append(ret.entity);
					this.myUser = ret.entity;
				}
				return ret
			})
		}
	});
}

export default userMgrService;