'use strict';


fileApiService.$inject = ['apiService', '$http'];
var files = [
{id: '0', favourite: false, name: 'monimage.jpeg', mime: 'mime', size: "500B", updatedAt: "2017-12-06T16:58:16.863Z"},
{id: '1', favourite: false, name: 'onchconh.jpeg', mime: 'mime', size: "854", updatedAt: "2017-12-02T16:58:16.863Z"},
{id: '2', favourite: false, name: 'deuxieme.jpeg', mime: 'mime', size: "123B", updatedAt: "2017-12-04T12:30:16.863Z"},
{id: '3', favourite: false, name: 'quooii.jpeg', mime: 'mime', size: "3K", updatedAt: "2017-12-06T16:01:16.863Z"},
]

function fileApiService(apiService, $http) {
  this.fetchAllFiles      = fetchAllFiles;
  this.singleUpload       = singleUpload;
  this.deleteFiles        = deleteFiles;
  this.createFolder       = createFolder;

  function fetchAllFiles(path = ['/']) {
    return apiService.graphql({query: `query ($path: [String!]!){
      allFiles(path: $path) {
        id
        filename
        realPath
        userPath
        mime
        size
        updatedAt
        directory
      }
    }`, variables: {path}})
    .then(ret => {
      if (ret.data && ret.data.allFiles) {
        return ({
          result: ret.data.allFiles
        })
      }
      throw ret
    })
  }

  function singleUpload(file, path) {
    console.log('sending ' + JSON.stringify({
      path,
      file
    }))
    return apiService.postFile('upload', {
      path,
      file
    })
    .then(ret => {
      if (ret.data && ret.data.file) {        
        return {
          result: ret.data.file
        }
      }
      throw ret
    })
  }

  function createFolder(name, path) {
    return apiService.graphql({query: `
      mutation createFolder($name: String!, $path: [String!]!) {
        createFolder(name: $name, path: $path) {
          id
          filename
          userPath
          mime
          size
          updatedAt
          directory
        }
      }`,
      variables: {name, path}
    })
    .then(ret => {
      if (ret.data) {
        return {
          result: ret.data.createFolder
        }
      }
      throw ret
    })
  }

  function deleteFiles(fileIds) {
    return apiService.graphql({query: `
      mutation deleteFiles($fileIds: [ID!]!) {
        deleteFiles(fileIds: $fileIds)
      }`,
      variables: {fileIds}
    })
  }
}

export default fileApiService;