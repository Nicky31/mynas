'use strict';

AppInit.$inject = ['$rootScope', 'utilService', 'userMgrService', 'fileMgrService', '$async'];
function AppInit($rootScope, utilService, userMgrService, fileMgrService, $async) {
	$rootScope.global = {
		title: 'DataHome',
		user: false,
		allFiles: []
	};

	$rootScope.logout = () => {
		utilService.destroySession()
		window.location.reload()
	}

	// My user session
	var user = utilService.getStoredSession()
	if (user) {
		$rootScope.router.setData('user', user);
		$rootScope.global.user = user;
		console.log('user = ' + JSON.stringify(user))
	}

	$async(async function() {
		try {
			var filesReq = await fileMgrService.fetchAll()
			$rootScope.global.allFiles = filesReq.entity
			console.log('retrieved files = '+ JSON.stringify($rootScope.global.allFiles))
		} catch (error) {
			console.log('error on fetch files : ' + JSON.stringify(error))
		}
	})();
};

export default AppInit;
