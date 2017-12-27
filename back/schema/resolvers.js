var files = []
module.exports = {
  Query: {
    allFiles: async (root, data, {user, services: {FileService}}) => {
      return FileService.findFiles({}, user)
    },
  },

  Mutation: {
    createFile: async (root, data, {user, mongo: {Files}, services: {FileService}}) => {
      return FileService.createFile(data, user)
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