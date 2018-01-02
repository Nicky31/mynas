'use strict';

AppInit.$inject = ['$rootScope', 'utilService', 'userMgrService', 'fileMgrService', '$async'];
function AppInit($rootScope, utilService, userMgrService, fileMgrService, $async) {
	$rootScope.global = {
		title: 'DataHome',
		breadcrumb: [{txt: "OwnSpace"}],
		user: false,
	};
	$rootScope.allFiles = []

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
};

export default AppInit;
