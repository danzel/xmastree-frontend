import * as Resources from './resources';
import * as ServerComms from './serverComms';
import { JustDate } from './justDate';

export class DecorationPlacingManager {
	onCancel: () => void;
	onComplete: (nextDecoration: number, now: JustDate) => void;
	enabled: boolean;

	constructor(private map: L.Map, private serverComms: ServerComms.ServerComms) {
	}

	start(decorationIndex: number) {
		this.enabled = true;
		//TODO: Find a random place, zoom down to it
		//TODO: highlight the placing one somehow

		this.map.flyTo(this.map.getCenter(), 4, { easeLinearity: 6, duration: 1 });

		let center = this.map.getCenter();
		let marker = L.imageOverlay(Resources.decorationImages[decorationIndex],
			Resources.padLatLngForDecoration(center, decorationIndex), { interactive: true }
		);

		//TODO: Appear animation would be cool
		this.map.addLayer(marker);

		L.DomEvent.disableClickPropagation((<any>marker)._image);

		let draggable = new (<any>L).Draggable((<any>marker)._image);
		draggable.enable();

		//TODO: Keep the decoration on the tree?

		draggable.on('dragend', () => {
			let endPos = L.DomUtil.getPosition((<any>marker)._image);

			endPos = endPos.add([(<any>marker)._image.clientWidth / 2, (<any>marker)._image.clientHeight / 2]);

			let endLatLng = this.map.layerPointToLatLng(endPos);

			(<any>marker).setBounds(Resources.padLatLngForDecoration(endLatLng, decorationIndex));

		})


		this.map.on('click', (ev) => {
			let latlng = (<L.MouseEvent>ev).latlng;

			(<any>marker).setBounds(Resources.padLatLngForDecoration(latlng, decorationIndex));
		})

		$('#placement-confirm-box').removeClass('hidden');
		$('#placement-instructions').removeClass('hidden');

		$('#placement-cancel').on('click', () => {
			this.map.removeLayer(marker);
			$('#placement-confirm-box').addClass('hidden');
			$('#placement-instructions').addClass('hidden');

			this.enabled = false;
			if (this.onCancel) {
				this.onCancel();
			}
		})
		$('#placement-locate').on('click', () => {
			let bounds = <L.LatLngBounds>(<any>marker).getBounds()
			this.map.flyTo(bounds.getCenter(), 4);
		})
		$('#placement-place').on('click', () => {

			let bounds = <L.LatLngBounds>(<any>marker).getBounds();
			let center = bounds.getCenter();

			if (!Resources.maxPlacementBounds.contains(center)) {
				//TODO: Nice looking alert
				alert("Please place your decoration on the tree")
				return;
			}

			//TODO: Should disable buttons during submit

			let now = JustDate.now();
			this.serverComms.addDecoration(center.lng, center.lat, now, (res) => {
				if (res.success) {
					//TODO: Nice looking alert
					//TODO: Your next decoration is...
					alert("Done! You can place another decoration tomorrow");

					draggable.disable();
					//TODO: Undo disableClickPropagation?

					$('#placement-confirm-box').addClass('hidden');
					$('#placement-instructions').addClass('hidden');

					this.enabled = false;
					if (this.onComplete) {
						this.onComplete(res.nextDecoration, now);
					}

				} else {
					//TODO: Nice looking alert
					alert('Something Failed :( Try again?');
				}
			})
		})
	}
}