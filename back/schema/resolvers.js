var files = []
module.exports = {
  Query: {
    allFiles: async (root, data, {services: {FileService}}) => {
      return FileService.getFilesIn()
    },
  },

  Mutation: {
    createFile: async (root, data, {mongo: {Files}, services: {FileService}}) => {
      return FileService.createFile(data)
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