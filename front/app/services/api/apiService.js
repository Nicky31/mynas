'use strict';

apiService.$inject = ['$http', 'API_URL', 'Upload'];

function apiService($http, API_URL, Upload) {

	this.graphql = (datas) => $http.post(API_URL + 'graphql', JSON.stringify(datas), {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	this.post = (path, datas) => $http.post(API_URL + path, JSON.stringify(datas), {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	this.postFile = (path, datas) =>  {
		return Upload.upload({
	  		url: API_URL + path,
	      	arrayKey: '',
	      	withCredentials: true,
	      	data: datas
	    })
	};
}

export default apiService;
