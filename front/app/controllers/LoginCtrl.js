'use strict';

LoginCtrl.$inject = ['$rootScope', '$scope', '$async', 'userMgrService']
export default function LoginCtrl($rootScope, $scope, $async, userMgrService) {
	$scope.form = {
		email: '',
		password: ''
	};
	console.log('refresh ' + JSON.stringify($scope.form))
	$scope.onLogin = () => {
		$async(async function () {
			try {
				const user = await userMgrService.login($scope.form.email, $scope.form.password)
				console.log('passed')				
			} catch (error) {
				console.log('login error:  ' + JSON.stringify(error))
			}
		})();
	};
}
