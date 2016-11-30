declare function require(fileName: string): string;

require('./favicon.png');
require('./favicon.ico');
require('./tree-120.png');


export const treeSvg = require('./images/tree.svg');

export const maxPlacementBounds = L.latLngBounds([[150, 220], [1000, 780]])

export const decorationImages = [
	//normal size 0-18
	require('./images/decorations/big-blue-center.svg'),
	require('./images/decorations/big-blue-left.svg'),
	require('./images/decorations/big-blue-right.svg'),
	require('./images/decorations/big-purple-left.svg'),
	require('./images/decorations/big-purple-right.svg'),
	require('./images/decorations/big-red-left.svg'),
	require('./images/decorations/big-red-right.svg'),
	require('./images/decorations/big-teal-left.svg'),
	require('./images/decorations/big-teal-right.svg'),
	require('./images/decorations/big-yellow-left.svg'),
	require('./images/decorations/big-yellow-right.svg'),
	require('./images/decorations/boot-down-left.svg'),
	require('./images/decorations/boot-down-right.svg'),
	require('./images/decorations/boot-mid-left.svg'),
	require('./images/decorations/boot-mid-right.svg'),
	require('./images/decorations/boot-up-left.svg'),
	require('./images/decorations/boot-up-right.svg'),
	require('./images/decorations/pointy-red-left.svg'),
	require('./images/decorations/pointy-red-right.svg'),
	
	//big size 19-38
	require('./images/decorations/big-blue-center.svg'),
	require('./images/decorations/big-blue-left.svg'),
	require('./images/decorations/big-blue-right.svg'),
	require('./images/decorations/big-purple-left.svg'),
	require('./images/decorations/big-purple-right.svg'),
	require('./images/decorations/big-red-left.svg'),
	require('./images/decorations/big-red-right.svg'),
	require('./images/decorations/big-teal-left.svg'),
	require('./images/decorations/big-teal-right.svg'),
	require('./images/decorations/big-yellow-left.svg'),
	require('./images/decorations/big-yellow-right.svg'),
	require('./images/decorations/boot-down-left.svg'),
	require('./images/decorations/boot-down-right.svg'),
	require('./images/decorations/boot-mid-left.svg'),
	require('./images/decorations/boot-mid-right.svg'),
	require('./images/decorations/boot-up-left.svg'),
	require('./images/decorations/boot-up-right.svg'),
	require('./images/decorations/pointy-red-left.svg'),
	require('./images/decorations/pointy-red-right.svg'),
];

export const decorationPadding = 5;

export function padLatLngForDecoration(latLng: L.LatLng, decorationIndex: number): L.LatLngBounds {
	let padding = decorationPadding;
	if (decorationIndex >= 19 && decorationIndex <= 38) {
		padding += 2;
	}
	return L.latLngBounds([latLng.lat - padding, latLng.lng - padding], [latLng.lat + padding, latLng.lng + padding]);
}