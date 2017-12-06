'use strict';


fileApiService.$inject = ['apiService', '$http'];
function fileApiService(apiService, $http) {
  this.fetchAllFiles      = fetchAllFiles;

  function fetchAllFiles() {
    return apiService.graphql(`{
      allFiles {
        id
        name
        description
      }
    }`)
    .then(ret => {
      console.log('allFiles =  ' + JSON.stringify(ret))
      if (ret.data && ret.data.allFiles)
        return ({
          success: true,
          entity: ret.data.allFiles
        })
      return false
    })
  }
}

export default fileApiService;