import './index.css';

import * as L from 'leaflet';
import * as $ from 'jquery';


declare function require(fileName: string): string;
var treeSvg = require('./images/tree.svg');

var decorationImages = [
	require('./images/decorations/big-yellow-right.svg')
]


/*
document.getElementById('load-data').onclick = () => {
	alert('lets go');
}*/

//let initialBounds = L.latLngBounds([[0, 0], [1000, 1000]]);
let maxPlacementBounds = L.latLngBounds([[150, 220], [1000, 780]])
let map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: -1,
	layers:
	[
		L.imageOverlay(treeSvg, L.latLngBounds([[0, 0], [1000, 1000]]), {
			attribution: 'TODO that image site'
		})
	],
});
map.fitBounds(maxPlacementBounds, {});
map.on('zoom', () => {
	console.log(map.getZoom());
})
map.on('click', (ev) => {
	let mev = <L.MouseEvent>ev;
	console.log('mc', mev.latlng.lat, mev.latlng.lng);
})



//TODO: Only on first load
//TODO $('#modal-welcome').modal('show');

const loggedIn = true;

$('#top-place-decoration').click(() => {
	if (loggedIn) {

		//TODO: Find a random place, zoom down to it
		//TODO: highlight the placing one somehow
		/*let marker = L.marker(map.getCenter(), {
			draggable: true
			//TODO: Icon
		})*/

		map.setZoom(4, {});

		let center = map.getCenter();
		let marker = L.imageOverlay(decorationImages[0],
			L.latLngBounds([center.lat - 5, center.lng - 5], [center.lat + 5, center.lng + 5]), { interactive: true }
		);
		//console.log(marker);
		//TODO: Appear animation would be cool
		map.addLayer(marker);
		let draggable = new (<any>L).Draggable((<any>marker)._image);
		draggable.enable();

		draggable.on('dragend', () => {
			let endPos = L.DomUtil.getPosition((<any>marker)._image);

			endPos = endPos.add([(<any>marker)._image.clientWidth / 2,(<any>marker)._image.clientHeight / 2]);

			let endLatLng = map.layerPointToLatLng(endPos);

			(<any>marker).setBounds(L.latLngBounds([[endLatLng.lat - 5, endLatLng.lng - 5], [endLatLng.lat + 5, endLatLng.lng + 5]]));

		})


		map.on('click', (ev) => {
			//marker.setLatLng((<L.MouseEvent>ev).latlng);
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