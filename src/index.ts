import './index.css';

import * as L from 'leaflet';
import * as $ from 'jquery';

import { DecorationPlacingManager } from './decorationPlacingManager';
import { JustDate } from './justDate';
import * as Resources from './resources';
import * as ServerComms from './serverComms';

//Configure the map
let maxPlacementBounds = L.latLngBounds([[150, 220], [1000, 780]])
let map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: -1,
	layers:
	[
		L.imageOverlay(Resources.treeSvg, L.latLngBounds([[0, 0], [1000, 1000]]), {
			attribution: 'TODO that image site'
		})
	],
});
map.fitBounds(maxPlacementBounds, {});

//State
let status: ServerComms.StatusResponse;

//Managers
let serverComms = new ServerComms.FakeServerComms();
let decorationPlacingManager = new DecorationPlacingManager(map, serverComms);

serverComms.getStatus((res) => {
	status = res;

	showButton();
});
serverComms.getAllDecorations((res) => {
	if (!res.success) {
		alert('Failed to load decorations. Server is probably down. Try again soon!');
		return;
	}

	res.decorations.forEach(d => {
		map.addLayer(L.imageOverlay(Resources.decorationImages[d[2]], Resources.padLatLngForDecoration(L.latLng(d[1], d[0]), d[2])));
	})
})

//TODO: Only on first load
//TODO $('#modal-welcome').modal('show');

const loggedIn = true;

function showButton() {
	//Global click handlers
	$('#top-place-decoration').removeClass('hidden').click(() => {
		if (decorationPlacingManager.enabled) {
			return;
		}

		if (status.authenticated) {
			let now = JustDate.now();
			if (now.value == status.dateLastPlaced) {
				//TODO: Nice looking alert
				alert('You have already placed a decoration today. Come back tomorrow')
			} else {
				decorationPlacingManager.start();
			}
		} else {
			$('#modal-login').modal('show');
		}
	})
}