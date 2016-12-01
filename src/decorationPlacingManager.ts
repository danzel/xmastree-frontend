import * as Resources from './resources';
import * as ServerComms from './serverComms';
import { JustDate } from './justDate';

export class DecorationPlacingManager {
	onCancel: () => void;
	onComplete: (nextDecoration: number, now: JustDate) => void;
	enabled: boolean;

	marker: L.ImageOverlay;
	decorationIndex: number;
	draggable: any;

	constructor(private map: L.Map, private serverComms: ServerComms.ServerComms) {

		
		$('#placement-cancel').on('click', () => {
			this.map.removeLayer(this.marker);
			this.marker = null;
			$('#placement-confirm-box').addClass('hidden');
			$('#placement-instructions').addClass('hidden');


			this.enabled = false;
			if (this.onCancel) {
				this.onCancel();
			}
		});
		$('#placement-locate').on('click', () => {
			let bounds = <L.LatLngBounds>(<any>this.marker).getBounds()
			this.map.flyTo(bounds.getCenter(), 4);
		})
		this.map.on('click', (ev) => {

			if (this.marker) {
				let latlng = (<L.MouseEvent>ev).latlng;
				(<any>this.marker).setBounds(Resources.padLatLngForDecoration(latlng, this.decorationIndex));
			}
		})

		$('#placement-place').on('click', () => {

			let bounds = <L.LatLngBounds>(<any>this.marker).getBounds();
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

					this.draggable.disable();
					//Undo the interactive flag
					L.DomUtil.removeClass((<any>this.marker)._image, 'leaflet-interactive');
					$((<any>this.marker)._image).removeClass('pulsate');
					(<any>this.marker).removeInteractiveTarget((<any>this.marker)._image);

					//TODO: Undo disableClickPropagation?

					$('#placement-confirm-box').addClass('hidden');
					$('#placement-instructions').addClass('hidden');

					this.enabled = false;
					if (this.onComplete) {
						this.onComplete(res.nextDecoration, now);
					}

					this.marker = null;
				} else {
					//TODO: Nice looking alert
					alert('Something Failed :( Try again?');
				}
			})
		})
	}

	start(decorationIndex: number) {
		this.enabled = true;
		this.decorationIndex = decorationIndex;
		//TODO: highlight the placing one somehow


		//Random placing
		//http://stackoverflow.com/questions/19654251/random-point-inside-triangle-inside-java
		let r1 = Math.random();
		let r2 = Math.random();
		
		//Triangle corners (roughly) of the tree
		let ax = 342;
		let ay = 239;
		let bx = 308;
		let by = 760;
		let cx = 953;
		let cy = 500;
		let x = (1 - Math.sqrt(r1)) * ax + (Math.sqrt(r1) * (1 - r2)) * bx + (Math.sqrt(r1) * r2) * cx;
		let y = (1 - Math.sqrt(r1)) * ay + (Math.sqrt(r1) * (1 - r2)) * by + (Math.sqrt(r1) * r2) * cy;
		let center = L.latLng(x, y);

		this.marker = L.imageOverlay(Resources.decorationImages[decorationIndex],
			Resources.padLatLngForDecoration(center, decorationIndex), { interactive: true }
		);

		//TODO: Appear animation would be cool
		this.map.addLayer(this.marker);
		this.map.flyTo(center, 4, { easeLinearity: 6, duration: 1 });

		L.DomEvent.disableClickPropagation((<any>this.marker)._image);
		$((<any>this.marker)._image).addClass('pulsate');

		this.draggable = new (<any>L).Draggable((<any>this.marker)._image);
		this.draggable.enable();

		//TODO: Keep the decoration on the tree?

		this.draggable.on('dragend', () => {
			let endPos = L.DomUtil.getPosition((<any>this.marker)._image);

			endPos = endPos.add([(<any>this.marker)._image.clientWidth / 2, (<any>this.marker)._image.clientHeight / 2]);

			let endLatLng = this.map.layerPointToLatLng(endPos);

			(<any>this.marker).setBounds(Resources.padLatLngForDecoration(endLatLng, decorationIndex));

		})



		$('#placement-confirm-box').removeClass('hidden');
		$('#placement-instructions').removeClass('hidden');
	}
}