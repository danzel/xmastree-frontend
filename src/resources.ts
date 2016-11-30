declare function require(fileName: string): string;

export const treeSvg = require('./images/tree.svg');

export const decorationImages = [
	require('./images/decorations/big-yellow-right.svg')
];

export const decorationPadding = 5;

export function padLatLngForDecoration(latLng: L.LatLng, decorationIndex: number): L.LatLngBounds {
	return L.latLngBounds([latLng.lat - decorationPadding, latLng.lng - decorationPadding], [latLng.lat + decorationPadding, latLng.lng + decorationPadding]);
}