var files = []
module.exports = {
  Query: {
    allFiles: async (root, data, {user, services: {FileService}}) => {
      const query = {folderId: data.folderId}
      return FileService.findFiles(query, user)
    },
  },

  Mutation: {
    createFile: async (root, data, {user, mongo: {Files}, services: {FileService}}) => {
      return FileService.createFile(data, user)
    },

    deleteFiles: async (root, data, {user, services: {FileService}}) => {
      return FileService.deleteFiles(data.fileIds, user)
    },

    createUser: async (root, data, {mongo: {Users}, services: {UserService}}) => {
      return UserService.createUser(data)
    }
  },

  File: {
    id: root => root._id || root.id, // 5
  },
  User: {
    id: root => root._id || root.id
  }
};