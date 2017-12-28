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

  function fetchAllFiles(folderId) {
    return apiService.graphql({query: `query ($folderId: String){
      allFiles(folderId: $folderId) {
        id
        filename
        filepath
        mime
        folderId
        size
        updatedAt
        directory
      }
    }`, variables: {folderId}})
    .then(ret => {
      if (ret.data && ret.data.allFiles) {
        return ({
          success: true,
          entity: ret.data.allFiles
        })
      }
      throw ret
    })
  }

  function singleUpload(file, folderId) {
    return apiService.postFile('upload', {
      folderId,
      file
    })
    .then(ret => {
      if (ret.data && ret.data.file) {        
        return {
          success: true,
          entity: ret.data.file
        }
      }
      throw ret
    })
  }

  function createFolder(name, parentId) {
    return apiService.graphql({query: `
      mutation createFolder($name: String!, $parentId: ID) {
        createFolder(name: $name, parentId: $parentId) {
          id
          filename
          filepath
          mime
          folderId
          size
          updatedAt
          directory
        }
      }`,
      variables: {name, parentId}
    })
    .then(ret => {
      if (ret.data) {
        return {
          success: true,
          entity: ret.data.createFolder
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