'use strict';

import angular from 'angular';
import 'angular-route';
import 'angular-cookies';
import "angular-async-await";

import 'ng-file-upload';
import routes from './routes';
import constantsLoader from './constants.js';
import AppInit from './appInit';

import utilService from './services/utilService';
import mapService from './services/mapService';
import apiService from './services/api/apiService.js';
import userApiService from './services/api/userApiService.js';
import userMgrService from './services/entities/userMgrService.js';
import linker from './services/entities/lib/EntityManagerLinker'

import HomeCtrl from './controllers/HomeCtrl.js'
import LoginCtrl from './controllers/LoginCtrl.js'

var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngFileUpload', 'angular-async-await']);
constantsLoader(app);
app
	.service('utilService', utilService)
	.service('mapService', mapService)
	.service('apiService', apiService)
	.service('userApiService', userApiService)
	.factory('userMgrService', userMgrService)

	.controller('HomeCtrl', HomeCtrl)
	.controller('LoginCtrl', LoginCtrl)

	.config(($routeProvider, $httpProvider) => {
		routes.config($routeProvider);
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.withCredentials = true;
	})
	.run(($rootScope, $cookies, userMgrService) => {
		$rootScope.router = routes;
		linker([
			userMgrService,
		])
	})
	.run(AppInit);
