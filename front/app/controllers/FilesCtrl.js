'use strict';

FilesCtrl.$inject = ['$rootScope', '$scope', 'fileMgrService', 'utilService', '$async']
const sidebarWidgets = [
	{include: './views/files/sidebarWidgets.html'}
]

export default function FilesCtrl($rootScope, $scope, fileMgrService, utilService, $async) {
	$scope.cwd = [] // Current working directory path
	$rootScope.global.breadcrumb = [{iconClassname: 'fa fa-home'}]
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
		const cwd = $scope.cwd.last()
		$scope.files = cwd	? $rootScope.allFiles.filter(cur => cur.folderId == cwd)
							: $rootScope.allFiles
		if ($scope.files)
			$scope.files.sort((a, b) => a.directory ? -1 : 1)
	}

	/*
	 * Widgets 
	 */
	$scope.newFolder = {
		name: false
	}

	$scope.submitNewFolder = () => {
		console.log('creating folder ' + $scope.newFolder.name)	
		$async(async function() {
			try {
				const cwd = $scope.cwd.last()
				const folder = await fileMgrService.createFolder($scope.newFolder.name, cwd)
				console.log('created foler ' + JSON.stringify(folder))
				$rootScope.allFiles = fileMgrService.worker.findAll()
			} catch (error) {
				console.log('error on new folder ' + JSON.stringify(error))
			}
			$scope.newFolder.name = ''
		})()
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


