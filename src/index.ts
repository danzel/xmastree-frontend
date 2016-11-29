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