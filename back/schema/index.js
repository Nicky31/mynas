const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');


// Define your types here.
const typeDefs = `

type Query {
  allFiles(folderId: String): [File!]!
}

type Mutation {
  createFile(filename: String!, mime: String!, size: Int!, folderId: ID): File!
  createFolder(name: String!, parentId: ID): File!
  deleteFiles(fileIds: [ID!]!): Boolean
  createUser(name: String!, credentials: AuthInputDatas!): User
}

type File {
  id: ID!
  filename: String!
  filepath: String!
  mime: String!
  folderId: ID
  size: Int!
  updatedAt: String!
  ownerId: ID!
  directory: Boolean
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

input AuthInputDatas {
  email: String!
  password: String!
}
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs, resolvers});