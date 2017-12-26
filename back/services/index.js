import FileService from './FileService.js';
import UserService from './UserService.js';

export default mongo => ({
	FileService: new FileService(mongo),
	UserService: new UserService(mongo)
})