'use strict';
import L from 'leaflet';

mapService.$inject = ['API_URL']
function mapService(API_URL) {
	this.initMap 		= initMap;
	this.setMarkers 	= setMarkers;
	this.refreshMap		= refreshMap;
	this.storeArtworks	= storeArtworks;
	this.filterArtworks	= filterArtworks;
	this.setupMapModal 	= setupMapModal;

	function initMap({blockId, centerGeoPos, zoom}) {
		var map = L.map(blockId).setView([centerGeoPos.lat, centerGeoPos.lng], zoom);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmF0b3VuNDIwIiwiYSI6ImNqOWQwdHJkaTFycTczMHQ0N3Z3eHRwY28ifQ.9Te5Yss6EP0wv2G37TYljA', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoiYmF0b3VuNDIwIiwiYSI6ImNqOWQwdHJkaTFycTczMHQ0N3Z3eHRwY28ifQ.9Te5Yss6EP0wv2G37TYljA'
		}).addTo(map);
		map.__markers = [];
		return (map);
	}

	function setMarkers(markers, map, clickEvent) {
		map.__markers = markers.map(cur => {
			const { artwork, popup } = cur;
			const geoPos = (artwork.location && artwork.location.geoPos)
			if (geoPos && geoPos.lat && geoPos.lng) {
				var marker = L.marker([geoPos.lat, geoPos.lng])
				if (popup)
					marker.bindPopup(popup);
				if (clickEvent) {
					marker.on('click', () => clickEvent(cur))
				}				
			} else {
				console.log('marker ' + artwork.title + ' doenst have geopos ' + JSON.stringify(artwork.location))
			}
			return (marker)
		});
		return (map);
	}

	function refreshMap(map, {geoPos, smooth, zoom} = {}) {
		if (geoPos && !smooth)
			map.setView(new L.LatLng(geoPos.lat, geoPos.lng), (zoom ? zoom : undefined));
		else if (geoPos)
			map.panTo(new L.LatLng(geoPos.lat, geoPos.lng));
		L.layerGroup(map.__markers).addTo(map);
	}

	function filterArtworks(query, map, onclick) {
		var keys = typeof query == 'object' ? Object.keys(query) : []
		var markers = [];
		map.__artworks.forEach(marker => {
			if (!keys.length || keys.reduce((last, cur) => last && marker.artwork[cur] == query[cur], true)) {
				if (marker.artwork && marker.artwork.location)
					markers.push(marker);
			}
		});
		setMarkers(markers, map, onclick)
	}

	function storeArtworks(artworks, map) {
		map.__artworks = artworks.map(formatArtworkMapPopup);
		return (map);
	}

	function formatArtworkMapPopup(artwork) {
		var { title, owner, description, pictures, tags, id } = artwork;
		if (!owner || !pictures)
			return {artwork}
		if (owner && description) {
			var popup = `
				<b>${title}</b> par ${owner.name}<br /><br/>
				<a href="${pictures[0]}" target="__blank" ng-if="pictures && pictures.length">
					<img src="${pictures[0]}" width="200" />
				</a> <br /> <br />
				${description} <br /><br />
				Tags: ${tags}
			`			
		} else 
			var popup = null
		return ({
			artwork: artwork,
			popup: popup,
			id
		})
	}

	function setupMapModal($scope, modalBlockId, openCallbackName, mapOpts = {}) {
		if (!$scope.ui)
			$scope.ui = {mapModal: false} 
		else
			$scope.ui.mapModal = false
		const defaultPos = mapOpts.geoPos || ({lat: 46.2, lng: 2.0})
		$scope.map = initMap({
			blockId: 'projectMap',
			centerGeoPos: defaultPos,
			zoom: 5,
			...mapOpts
		})	

		$scope[openCallbackName] = (allProjects = {}) => {
			if (!Array.isArray(allProjects))
				allProjects = [allProjects]
			var project = (allProjects[0] || {})
			$scope.ui.mapModal = project

			// On reset les artworks / markers de la map
			storeArtworks(allProjects, $scope.map)
			setTimeout(() => {
				$scope.map.invalidateSize()
				if (project.location) {
					setMarkers($scope.map.__artworks, $scope.map, marker => {
						// Click sur un des markers : On change le contenu de la modal
						if ($scope.ui.mapModal != marker.artwork) {
							refreshMap($scope.map, {geoPos: (marker.artwork.location && marker.artwork.location.geoPos), smooth: true})
							$scope.ui.mapModal = marker.artwork;					
							$scope.$apply();
						}
					})
				}
				// Placement initial de la map
				refreshMap($scope.map, {geoPos: (project.location && project.location.geoPos) || defaultPos, zoom: 8, ...mapOpts})
			}, 10)

			var modalContent = document.getElementById(modalBlockId)
			if (modalContent) {
				modalContent.onclick = e => e.stopPropagation()
			}
		}
	}
}


export default mapService