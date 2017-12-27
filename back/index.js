const config = require('./config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const Services = require('./services').default
const connectMongo = require('./mongo-connector');

(async function() {
	var mongo = await connectMongo()
	const services = Services(mongo)
	var app = express();
	app.use(bodyParser()) // Parse JSON content
	app.use(cookieParser()); // Parse input cookies to req object (req.cookies)
	app.use(expressJwt({ // Parse input session token to deserialized user session
	  	secret: config.auth_secret,
  		credentialsRequired: false,
		getToken: req => req.cookies.token,
	}));
	app.use(fileUpload()) // Parse input file uploads to req object (req.files.[fieldname])

	const corsOptions = {
		origin: 'http://localhost:2000',
		credentials: true,
  		"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  		"allowedHeaders": "Content-Type,Accept",
  		"preflightContinue": false,
	}
	app.use(cors(corsOptions)) // Enable CORS

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

	app.use((req, res, next) => {
		if (req.user)
			next();
		else
			res.status(401).send('Unauthorized')
	})

	app.use('/upload', async (req, res) => {
  		if (!req.files)
	    	return res.status(400).send('No files were uploaded.');
	    var upload = req.files.file
	    var fileInfos = {
	    	folderId: req.body.folderId,
	    	filename: upload.name,
	    	mime: upload.mimetype,
	    	size: upload.data.length
	    }

	    const uploaded = await services.FileService.createFile(fileInfos, req.user)
	    return upload.mv(uploaded.filepath)
	    .then(ret => {
	    	return res.json({file: uploaded})
	    })
	    .catch(error => {
	    	return res.status(400).json({error: "Error happened during file upload"})
	    })
	})

  	const buildOptions = async (req, res) => {
    	const user = req.user
    	return {
      		context: {mongo, user, services}, // This context object is passed to all resolvers.
      		schema,
    	};
  	};
	app.use('/graphql', graphqlExpress(buildOptions));
	app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

	app.listen(config.port, () => {
	  console.log(`Hackernews GraphQL server running on port ${config.port}.`)
	});
})()
