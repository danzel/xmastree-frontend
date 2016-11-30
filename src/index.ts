import './index.css';

import * as L from 'leaflet';
import * as $ from 'jquery';


declare function require(fileName: string): string;
var treeSvg = require('./images/tree.svg');


/*
document.getElementById('load-data').onclick = () => {
	alert('lets go');
}*/

let maxBounds = L.latLngBounds([[0, 0], [1000, 1000]]);
let map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: -1,
	layers:
	[
		L.imageOverlay(treeSvg, maxBounds, {
			attribution: 'TODO that image site'
		})
	],
});
map.fitBounds(maxBounds, {});
map.on('zoom', () => {
	console.log(map.getZoom());
})

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