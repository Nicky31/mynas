'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope']
export default function FilesCtrl($rootScope, $scope) {
	if (!$scope.viewMode) {
		$scope.viewMode = 'all'
		$rootScope.global.sidebar.setLinks([
			{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
		])

		$scope.selected = []
		$scope.files = $rootScope.global.allFiles
	}

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
}


