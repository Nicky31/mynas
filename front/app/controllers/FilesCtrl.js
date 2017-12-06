'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope']
export default function FilesCtrl($rootScope, $scope) {
	$rootScope.global.sidebar.setLinks([
		{iconClassname: 'icon-speedometer', name: 'test', action: () => console.log('test')},
	])
}