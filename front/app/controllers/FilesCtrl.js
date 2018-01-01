'use strict';
import _ from 'underscore'

FilesCtrl.$inject = ['$rootScope', '$scope', 'fileMgrService', 'utilService', '$async']
const sidebarWidgets = [
	{include: './views/files/sidebarWidgets.html'}
]

const sidebarLinks = [
	{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
]

export default function FilesCtrl($rootScope, $scope, fileMgrService, utilService, $async) {
	$scope.cwd = ['/'] // Current working directory path
	$rootScope.global.breadcrumb = [{iconClassname: 'fa fa-home'}]
	$scope.viewMode = 'all'
	$rootScope.global.sidebar.setLinks(sidebarLinks)
	$rootScope.global.sidebar.setWidgets(sidebarWidgets)

	$scope.selection = {
		fileIds: [],
		totalSize: 0
	}
	$scope.files = []
	$rootScope.$watch('allFiles', (allFiles, oldVal) => {
		refreshFiles()
	})		

	$scope.toggleSelect = file => {
		if (file == true) {
			const checked = ($scope.selection.fileIds.length == 0)
			$scope.selection.fileIds = checked ? $scope.files.map(cur => cur.id) : []
			document.querySelectorAll('.fileCkb').forEach(ckb => ckb.checked = checked)
			calcSelectedSize();
			return ;
		}
		const idx = $scope.selection.fileIds.findIndex(cur => cur == file.id)
		if (idx == -1) {
			$scope.selection.fileIds.push(file.id)
			calcSelectedSize()
			return ;
		}
		$scope.selection.fileIds.splice(idx, 1)
		calcSelectedSize();
	}

	$scope.toggleFavourite = file => {
		file.favourite = !file.favourite
	}

	$scope.select = file => {
		if (file.directory) {
			$scope.cwd.push(file.filename)
			console.log('cwd =  ' + JSON.stringify($scope.cwd))
			$rootScope.$emit('OnFilesWorkingDirectoryChange', $scope.cwd)
			fileMgrService.findFiles($scope.cwd).then(ret => {
				$rootScope.allFiles = ret.entity
			})
		}
	}

	$scope.downloadSelection = () => {
		console.log('download')
	}

	$scope.deleteSelection = () => {
		$async(async function() {
			try {
				const ret = await fileMgrService.delete($scope.selection.fileIds)
				$scope.selection.fileIds = []
				$rootScope.allFiles = fileMgrService.worker.findAll()
			} catch (error) {
				console.log('error on delete')
			}
		})();
	}

	function calcSelectedSize() {
		$scope.selection.totalSize = utilService.getHumanSize(
			$scope.files.filter(cur => $scope.selection.fileIds.includes(cur.id)).reduce((totalSize, curFile) => (totalSize  + curFile.size), 0)
		)
	}
	function refreshFiles() {
		if (!$rootScope.allFiles)
			return
		$scope.files = $scope.cwd	? $rootScope.allFiles.filter(cur => _.isEqual(cur.userPath, $scope.cwd))
									: $rootScope.allFiles
		if ($scope.files)
			$scope.files.sort((a, b) => a.directory ? -1 : 1)
	}
}


