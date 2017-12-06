import Router from './lib/Router';

const logged = user => user && typeof user.id != 'undefined'

const router = new Router(function(datas) {
	this.group('logged', () => logged(this.datas.user), 'views/member403.html')

		.route('/', {redirectTo: '/home'})
		.route('/home', {
			templateUrl: 'views/home/index.html',
			controller: 'HomeCtrl'
		})
		.route('/files', {
			templateUrl: 'views/files/index.html',
			controller: 'FilesCtrl'
		})
		.route('/agenda', {
			templateUrl: 'views/agenda/index.html',
			controller: 'AgendaCtrl'
		})
		.route('/notes', {
			templateUrl: 'views/notes/index.html',
			controller: 'NotesCtrl'
		})
		.route('/403', {templateUrl: 'views/member403.html'})
		.set404View('views/404.html');
});

export default router;