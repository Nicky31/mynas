'use strict';

HomeCtrl.$inject = ['$rootScope', '$scope']
export default function HomeCtrl($rootScope, $scope) {
	$rootScope.global.breadcrumb = [{txt: 'Dashboard'}]
}