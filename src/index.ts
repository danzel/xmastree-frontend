import './index.css';

import * as L from 'leaflet';
import * as $ from 'jquery';

/*
document.getElementById('load-data').onclick = () => {
	alert('lets go');
}*/

let map = L.map('map', {
	//center: L.latLng(0, 0),
	//zoom: 0,

	layers:
	[
		L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
			attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoiZGF2ZWxlYXZlciIsImEiOiJjaXZ4OGtxbGcwMWR6MnlvMnZzY3ljejMxIn0.4aRVH6XUayzkw6c4XtCkuw'
		})
		/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	})*/
	],
});
map.fitBounds(L.latLngBounds([[-48, 179], [-33, 164]]), {});

//TODO: Only on first load
$('#modal-welcome').modal('show');

const loggedIn = true;

$('#top-place-decoration').click(() => {
	if (loggedIn) {
		let marker = L.marker(map.getCenter(), {
			draggable: true
			//TODO: Icon
		})
		//TODO: Appear animation would be cool
		map.addLayer(marker);

		map.on('click', (ev) => {
			marker.setLatLng((<L.MouseEvent>ev).latlng);
		})

		$('#placement-confirm-box').removeClass('hidden');
		$('#placement-instructions').removeClass('hidden');
	} else {
		$('#modal-login').modal('show');
	}
})

$.ajax({
	method: 'POST',
	url: 'http://localhost:3000/api/decorations/add/v1',
	xhrFields: {
		withCredentials: true
	},
	data: {
		x: 1,
		y: 1,
		date: 20161130
	}
}).done(res => {
	console.log('done', res);
}).fail(res => {
	console.log('fail', res);
})