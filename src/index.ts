import './index.css';

import * as L from 'leaflet';
import * as $ from 'jquery';

import { DecorationPlacingManager } from './decorationPlacingManager';
import { JustDate } from './justDate';
import * as Resources from './resources';
import * as ServerComms from './serverComms';

//Configure the map
let map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: -1,
	layers:
	[
		L.imageOverlay(Resources.treeSvg, L.latLngBounds([[0, 0], [1000, 1000]]), {
			attribution: '<a href="#" data-toggle="modal" data-target="#modal-attribution">Attribution</a> | <a href="https://docs.google.com/a/cozybarrel.com/forms/d/e/1FAIpQLSdrXYeI1JfL-xOTE4iTlB5H9p2Y4AEbhnYrygKrJsEK-EUJag/viewform" target="_blank">Contact and Feedback</a>'
		})
	],
});
map.fitBounds(Resources.maxPlacementBounds, {});

//Set up auth buttons
$('a.btn-twitter').attr('href', ServerComms.serverBaseUrl + '/auth/twitter');
$('a.btn-facebook').attr('href', ServerComms.serverBaseUrl + '/auth/facebook');
$('a.btn-google').attr('href', ServerComms.serverBaseUrl + '/auth/google');

//State
let status: ServerComms.StatusResponse;

//Managers
//let serverComms = new ServerComms.FakeServerComms();
let serverComms = new ServerComms.RealServerComms();
let decorationPlacingManager = new DecorationPlacingManager(map, serverComms);

serverComms.getStatus((err, res) => {
	if (err) {
		//TODO: Nice looking alert
		alert('Failed to get status. Server is probably down. Try again soon!')
	}
	status = res;

	showAddDecorationButton();

	if (status.authenticated) {
		$('#top-logout').removeClass('hidden').on('click', () => {
			window.location.assign(ServerComms.serverBaseUrl + '/logout');
		})
	} else {
		$('#modal-welcome').modal('show');
	}
});
serverComms.getAllDecorations((res) => {
	if (!res.success) {
		//TODO: Nice looking alert
		alert('Failed to load decorations. Server is probably down. Try again soon!');
		return;
	}

	res.decorations.forEach(d => {
		try {
			map.addLayer(L.imageOverlay(Resources.decorationImages[d[2]], Resources.padLatLngForDecoration(L.latLng(d[1], d[0]), d[2])));
		}
		catch (err) {
			console.log('failed to add decoration server returned', err);
		}
	})
})

decorationPlacingManager.onComplete = (nextDecoration, now) => {
	status.amountPlaced++;
	status.dateLastPlaced = now.value;
	status.nextDecoration = nextDecoration;
}

const loggedIn = true;

function showAddDecorationButton() {
	//Global click handlers
	$('#top-place-decoration').removeClass('hidden').click(() => {
		if (decorationPlacingManager.enabled) {
			return;
		}

		if (status.authenticated) {
			let now = JustDate.now();
			if (now.value <= status.dateLastPlaced) {
				//TODO: Nice looking alert
				alert('You have already placed a decoration today. Come back tomorrow')
			} else {
				decorationPlacingManager.start(status.nextDecoration);
			}
		} else {
			$('#modal-login').modal('show');
		}
	})
}