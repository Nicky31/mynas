'use strict';

LoginCtrl.$inject = ['$rootScope', '$scope', '$async', 'userMgrService', 'utilService']
export default function LoginCtrl($rootScope, $scope, $async, userMgrService, utilService) {
	$scope.form = {
		email: '',
		password: '',
		error: ''
	};
	console.log('refresh ' + JSON.stringify($scope.form))
	$scope.onLogin = () => {
		$async(async function () {
			try {
				const user = await userMgrService.task('Login', $scope.form.email, $scope.form.password)			
				if (!user)
					throw ({error: 'bad creds'})
				utilService.storeSession(user);
				window.location.reload()
			} catch (error) {
				console.log('login error:  ' + JSON.stringify(error))
				$scope.form.error = 'Mauvais identifiants';
			}
		})();
	};
}
