'use strict';
import _ from 'underscore'

FilesCtrl.$inject = ['$rootScope', '$scope', 'fileMgrService', 'utilService', '$async', '$routeParams']
const sidebarWidgets = [
	{include: './views/files/sidebarWidgets.html'}
]

const sidebarLinks = [
	{iconClassname: 'fa fa-folder', name: 'Tous les fichiers', action: () => $scope.viewMode = 'all'},
]

export default function FilesCtrl($rootScope, $scope, fileMgrService, utilService, $async, $routeParams) {
	$scope.cwd = $routeParams.path && $routeParams.path.length ? ['/', ...$routeParams.path.split('/')] : ['/'] // Current working directory path
	$scope.selection = {
		fileIds: [],
		totalSize: 0
	}
	$scope.files = []
	$scope.viewMode = 'all'

	$rootScope.global.sidebar.setLinks(sidebarLinks)
	$rootScope.global.sidebar.setWidgets(sidebarWidgets)
	buildBreadcrumb()
	$rootScope.$watch('allFiles', (allFiles, oldVal) => {
		refreshFiles()
	})		

	$rootScope.$on('OnFilesWorkingDirectoryChange', (evt, cwd) => {
		$scope.cwd = cwd
		console.log('cwd =  ' + JSON.stringify($scope.cwd))
		buildBreadcrumb()
		fileMgrService.task('ReadDir', $scope.cwd).then(ret => {
			$rootScope.allFiles = ret
		})
	})

	refreshFiles()

	function buildBreadcrumb() {
		var curPath = ''
		$rootScope.global.breadcrumb = $scope.cwd.map(dir => {
			curPath += (dir != '/' ? ('/' + dir) : '')
			if (dir == '/')
				return {iconClassname: 'fa fa-home', href: "#!/files"}
			return {txt: dir, href: "#!/files" + curPath}
		})
	}

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
			$rootScope.$emit('OnFilesWorkingDirectoryChange', [...$scope.cwd, file.filename])
		}
	}

	$scope.downloadSelection = () => {
		console.log('download')
	}

	$scope.deleteSelection = () => {
		$async(async function() {
			try {
				await fileMgrService.task('Delete', $scope.selection.fileIds)
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

	async function refreshFiles() {
		if ($rootScope.allFiles) {
			$scope.files = $scope.cwd	? $rootScope.allFiles.filter(cur => _.isEqual(cur.userPath, $scope.cwd))
										: $rootScope.allFiles
			$scope.files.sort((a, b) => a.directory ? -1 : 1)			
		}

		if (!$scope.files.length && !fileMgrService.getLastTask('ReadDir', $scope.cwd)) {
			var filesReq = await fileMgrService.task('ReadDir', $scope.cwd)
			if (!filesReq)
				return 
			$rootScope.allFiles = [...$rootScope.allFiles, ...filesReq]
		} 
	}

}


