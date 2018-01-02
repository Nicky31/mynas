import EntityManager from './lib/EntityManager';
import userModel from './models/userModel';

userMgrService.$inject = ['userApiService'];
function userMgrService(userApiService) {
	return new EntityManager(userModel,
	{
		Login: {
			params: ['user', 'pwd'],
			handler: function(user, pwd) {
				return userApiService.login(user, pwd)
				.then(ret => {
					var user = this.task('InsertEntity', ret.result)
					this.myUser = user
					return user
				})
			}
		}
	})
}
export default userMgrService


