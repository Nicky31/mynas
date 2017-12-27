'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope', 'fileMgrService', 'utilService', '$async']
const sidebarWidgets = [
	{include: './views/files/sidebarWidgets.html'}
]

export default function FilesCtrl($rootScope, $scope, fileMgrService, utilService, $async) {
	$scope.cwd = undefined // Current working directory
	$scope.viewMode = 'all'
	$rootScope.global.sidebar.setLinks([
		{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
	])
	$rootScope.global.sidebar.setWidgets(sidebarWidgets)

	$scope.selection = {
		fileIds: [],
		totalSize: 0
	}
	$scope.files = []
	$rootScope.$watch('allFiles', allFiles => {
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

	$scope.downloadSelection = () => {
		console.log('download')
	}

	$scope.deleteSelection = () => {
		console.log('delete')
	}

	function calcSelectedSize() {
		console.log('selected files :' + JSON.stringify($scope.files.filter(cur => $scope.selection.fileIds.includes(cur.id))))
		$scope.selection.totalSize = utilService.getHumanSize(
			$scope.files.filter(cur => $scope.selection.fileIds.includes(cur.id)).reduce((totalSize, curFile) => (totalSize  + curFile.size), 0)
		)
	}

	function refreshFiles() {
		$scope.files = $rootScope.allFiles
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

	$scope.openUploadWindow = () => document.getElementById('uploadFileForm').click()

	$scope.uploadFile = async (file, errFiles) => {
	  	if (file && (!errFiles || !errFiles.length)) {
			$async(async function() {
				try {
					const upload = await fileMgrService.upload(file)
					$rootScope.allFiles = fileMgrService.worker.findAll()
				} catch (error) {
					console.log('got error :' + JSON.stringify(error))
				}
			})();
		}
	}
}


