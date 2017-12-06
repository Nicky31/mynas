'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope']
export default function FilesCtrl($rootScope, $scope) {
	$scope.viewMode = 'all'

	$rootScope.global.sidebar.setLinks([
		{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
	])

	var icon = "https://s3.amazonaws.com/uifaces/faces/twitter/fffabs/128.jpg"
	$scope.selected = []
	$scope.files = [
		{id: '0', name: 'monimage.jpeg', type: 'mime', icon: icon, size: "500B", updatedAt: "2017-12-06T16:58:16.863Z"},
		{id: '1', name: 'onchconh.jpeg', type: 'mime', icon: icon, size: "854", updatedAt: "2017-12-02T16:58:16.863Z"},
		{id: '2', name: 'deuxieme.jpeg', type: 'mime', icon: icon, size: "123B", updatedAt: "2017-12-04T12:30:16.863Z"},
		{id: '3', name: 'quooii.jpeg', type: 'mime', icon: icon, size: "3K", updatedAt: "2017-12-06T16:01:16.863Z"},
	]

	$scope.toggleSelect = file => {
		const idx = $scope.selected.findIndex(cur => cur.id == file.id)
		if (idx == -1) {
			$scope.selected.push(file.id)
			return ;
		}
		$scope.splice(idx, 1)
	}
}