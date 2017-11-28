'use strict';

const express =  require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const env = require('./env');

const app = express();

app.use(cookieParser())
app.use(express.static(env.PATH.APP_PUBLIC));

app.all('*', (req, res) => {
	res.status(200);
	const endpoint = req.cookies.token ? 'layout/index.html' : 'layout/login.html'
	res.sendFile(path.join(env.PATH.APP_PUBLIC, endpoint));
});

app.listen(env.SERVER.PORT, () => {
	console.log('Server listening on port ' + env.SERVER.PORT);
});
