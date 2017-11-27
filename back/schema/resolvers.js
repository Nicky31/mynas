var files = []
module.exports = {
  Query: {
    allFiles: async (root, data, {mongo: {Files}}) => { //{mongo: {Files}}
      return await Files.find({}).toArray()
    },
  },

  Mutation: {
    createFile: async (root, data, {mongo: {Files}}) => {
      const response = await Files.insert(data)
      return Object.assign({id: response.insertedIds[0]}, data)
    },

    createUser: async (root, data, {mongo: {Users}}) => {
      const newUser = {
        name: data.name,
        email: data.credentials.email,
        password: data.credentials.password
      }
      const response = await Users.insert(newUser)
      return Object.assign({id: response.insertedIds[0]}, newUser)
    }
  },

  File: {
    id: root => root._id || root.id, // 5
  },
  User: {
    id: root => root._id || root.id
  }
};