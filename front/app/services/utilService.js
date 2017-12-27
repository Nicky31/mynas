'use strict';


utilService.$inject = ['$http', '$cookies', 'userMgrService', 'userApiService'];
function utilService($http, $cookies, userMgrService, userApiService) {
	this.storeSession			= storeSession;
	this.getStoredSession		= getStoredSession;
	this.destroySession			= destroySession;
	this.bindGooglePlaceInput 	= bindGooglePlaceInput;
	this.getHumanSize			= getHumanSize

	function getStoredSession()  {
		var user = $cookies.getObject('user');
		if (!user)
			return false;
		delete user.__model
		userMgrService.myUser = userMgrService.worker.append(user);
		return (user);
	}

	function destroySession() {
		userMgrService.myUser = {};
		$cookies.remove('user');
		$cookies.remove('token');
	}

	function storeSession(user) {
		userMgrService.myUser = user;
      	$cookies.putObject('user', user, {expires: new Date("Aug 9, 2018")});
	}

	function bindGooglePlaceInput(inputElement, callback) {
		var searchBox = new google.maps.places.SearchBox(inputElement);
		searchBox.addListener('places_changed', () => {
			searchBox.getPlaces().forEach(place => {
				if (place.geometry && place.formatted_address) {
					callback ({
						address: place.formatted_address,
						geoPos: {
							lat: place.geometry.location.lat(),
							lng: place.geometry.location.lng(),
						}
					});
				}
			});
		});
		return searchBox
	}


}

function getHumanSize(bytes) {
	const units = {
		'GB': 1000000000,
		'MB': 1000000,
		'KB': 1000
	}
	for (var cur in units) {
		if (bytes >= units[cur])
			return ((bytes / units[cur]).toFixed(2)) + ' ' + cur
	}
	return bytes + ' B'
}

export default utilService;
export { getHumanSize }