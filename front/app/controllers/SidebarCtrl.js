'use strict';

SidebarCtrl.$inject = ['$rootScope', '$scope', '$location']
export default function SidebarCtrl($rootScope, $scope, $location) {
	$scope.baseLinks = [
		{iconClassname: 'icon-speedometer', name: 'Dashboard', action: () => $location.path('/')},
	]
	$scope.baseWidgets = []

	$scope.pageLinks = []
	$scope.pageWidgets = []

	$scope.global.sidebar = {
		setLinks: links => $scope.pageLinks = links,
		setWidgets: widgets => $scope.pageWidgets = widgets,
	}

	$scope.$on('$routeChangeStart', function($event, next, current) { 
		$scope.pageLinks = []
		$scope.pageWidgets = []
	 });
}