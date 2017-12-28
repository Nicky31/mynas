'use strict';

apiService.$inject = ['$http', 'API_URL', 'Upload'];

function apiService($http, API_URL, Upload) {

	this.graphql = (datas) => {
		if (typeof datas != 'object')
			datas = { query: datas }
		return $http.post(API_URL + 'graphql', JSON.stringify(datas), {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(ret => {
			if (ret.status != 200)
				throw {error: 'Bad status', resp: ret}
			return ret.data
		})
	}

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

	this.graphqlUpload = (query) => {
		return this.postFile('graphql', query)
	}
}

export default apiService;
