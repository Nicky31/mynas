'use strict';

NotesCtrl.$inject = ['$rootScope', '$scope']
export default function NotesCtrl($rootScope, $scope) {
	$rootScope.global.breadcrumb = [{txt: 'Notes'}]
}