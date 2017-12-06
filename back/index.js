const config = require('./config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');

const connectMongo = require('./mongo-connector');

(async function() {
	mongo = await connectMongo()
	var app = express();
	app.use(bodyParser())
	app.use(cookieParser());
	app.use(expressJwt({
	  	secret: config.auth_secret,
  		credentialsRequired: false,
		getToken: req => req.cookies.token,
	}));

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "http://localhost:2000");
	  res.header("Access-Control-Allow-Credentials", "true");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.use('/auth', async (req, res) => {
		if (!req.body || !req.body.email || !req.body.password)
			return res.json({error: 'Auth requires email and password !'})
  		const user = await mongo.Users.findOne({email: req.body.email})
  		if (user && req.body.password == user.password) {
  			delete user.password
  			const expiresIn = (60 * 60 * 24 * 180)
  			res.cookie('token', jwt.sign(user, config.auth_secret, { expiresIn }), { maxAge: (expiresIn * 1000), httpOnly: true})
    		return res.json({ user })
  		}
  		return res.json({error: 'Bad credentials'})
	});

  	const buildOptions = async (req, res) => {
    	const user = req.user
    	return {
      		context: {mongo, user}, // This context object is passed to all resolvers.
      		schema,
    	};
  	};
	app.use('/graphql', graphqlExpress(buildOptions));
	app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

	app.listen(config.port, () => {
	  console.log(`Hackernews GraphQL server running on port ${config.port}.`)
	});
})()
