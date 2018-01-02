
FilePageWidgetsCtrl.$inject = ['$rootScope', '$scope', '$async', 'fileMgrService', '$routeParams']
export default function FilePageWidgetsCtrl($rootScope, $scope, $async, fileMgrService, $routeParams) {
	
	$scope.cwd = $routeParams.path && $routeParams.path.length ? ['/', ...$routeParams.path.split('/')] : ['/']

	$scope.newFolder = {
		name: false
	}

	$rootScope.$on('OnFilesWorkingDirectoryChange', (evt, cwd) => {
		$scope.cwd = cwd
	})

	$scope.submitNewFolder = () => {
		$async(async function() {
			try {
				const folder = await fileMgrService.task('CreateFolder', $scope.newFolder.name, $scope.cwd)
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
	  		$rootScope.$emit('OnUploadFile', file)
			$async(async function() {
				try {
					const upload = await fileMgrService.task('Upload', file, $scope.cwd)
					$rootScope.allFiles = fileMgrService.worker.findAll()
				} catch (error) {
					console.log('got error :' + JSON.stringify(error))
				}
			})();
		}
	}
}
