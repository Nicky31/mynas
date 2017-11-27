const {MongoClient} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017/files';

// 2
module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL);
  return {
  	Files: db.collection('files'),
  	Users: db.collection('users')
  };
}