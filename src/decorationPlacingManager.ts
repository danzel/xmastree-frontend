import * as Resources from './resources';
import * as ServerComms from './serverComms';

export class DecorationPlacingManager {
	onCancel: () => void;
	enabled: boolean;

	constructor(private map: L.Map, private serverComms: ServerComms.ServerComms) {
	}

	start() {
		this.enabled = true;
		//TODO: Find a random place, zoom down to it
		//TODO: highlight the placing one somehow

		//TODO: The type should come from the server
		const decorationIndex = 0;

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
	}
}