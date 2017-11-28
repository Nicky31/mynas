'use strict';

AppInit.$inject = ['$rootScope', 'utilService', 'userMgrService', '$async'];
function AppInit($rootScope, utilService, userMgrService, $async) {
	$rootScope.global = {
		title: 'DataHome',
		user: false
	};

	// My user session
	var user = utilService.getStoredSession()
	if (user) {
		$rootScope.router.setData('user', user);
		$rootScope.global.user = user;
	}
};

export default AppInit;
