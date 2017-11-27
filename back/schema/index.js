const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');


// Define your types here.
const typeDefs = `
  	type Query {
  		allFiles: [File!]!
  	}

	type Mutation {
		createFile(name: String!, description: String!): File
		createUser(name: String!, credentials: AuthInputDatas!): User
	}

	type File {
    	id: ID!
    	name: String!
    	description: String!
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