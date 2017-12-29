const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');


// Define your types here.
const typeDefs = `

type Query {
  allFiles(path: [String!]!): [File!]!
}

type Mutation {
  createFile(filename: String!, mime: String!, size: Int!, path: [String!]!): File!
  createFolder(name: String!, path: [String!]!): File!
  deleteFiles(fileIds: [ID!]!): Boolean
  createUser(name: String!, credentials: AuthInputDatas!): User
}

type File {
  id: ID!
  realPath: String!
  userPath: [String!]!
  filename: String!
  mime: String!
  size: Int!
  updatedAt: String!
  ownerId: ID!
  directory: Boolean!
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