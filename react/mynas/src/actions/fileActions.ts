import backend from 'lib/Backend';
import ReduxActions from 'actions/';

export function upload(params: UploadRequestShape) {
    return () => {
        return backend.upload(params)
        .then(ret => {
            console.log(ret)
        })
    }
}

export function fetchFiles(path: FilePathShape = ['/']) {
    return () => {
        return backend.graphql({query: `query ($path: [String!]!){
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
          }`, variables: { path }})
          .then(ret => {
            if (ret.data && ret.data.allFiles) {
              return ret.data.allFiles
            }
            throw ret
          })          
    }
}

export function createFolder(name: string, path: FilePathShape) {
    return () => {
        return backend.graphql({query: `
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
                return ret.data.createFolder
            }
            throw ret
        })        
    }
}

export function deleteFiles(fileIds: string[]) {
    return () => {
        return backend.graphql({query: `
            mutation deleteFiles($fileIds: [ID!]!) {
                deleteFiles(fileIds: $fileIds)
            }`,
            variables: {fileIds}
        })        
    }
}