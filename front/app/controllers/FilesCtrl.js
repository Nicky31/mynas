'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope']
const sidebarWidgets = [
	{include: './views/files/sidebarWidgets.html'}
]

export default function FilesCtrl($rootScope, $scope) {
	$scope.viewMode = 'all'
	$rootScope.global.sidebar.setLinks([
		{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
	])
	$rootScope.global.sidebar.setWidgets(sidebarWidgets)

	$scope.selected = []
	$scope.files = $rootScope.global.allFiles

	$scope.toggleSelect = file => {
		if (file == true) {
			const checked = ($scope.selected.length == 0)
			$scope.selected = checked ? $scope.files.map(cur => cur.id) : []
			document.querySelectorAll('.fileCkb').forEach(ckb => ckb.checked = checked)
			return ;
		}
		const idx = $scope.selected.findIndex(cur => cur == file.id)
		if (idx == -1) {
			$scope.selected.push(file.id)
			return ;
		}
		$scope.selected.splice(idx, 1)
	}

	$scope.toggleFavourite = file => {
		file.favourite = !file.favourite
	}


	/*
	 * Widgets 
	 */
	$scope.newFolder = {
		name: false
	}

	$scope.submitNewFolder = () => {
		console.log('creating folder ' + $scope.newFolder.name)	
		$scope.newFolder.name = ''
	}
}


