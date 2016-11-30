import { JustDate } from './justDate';

export interface StatusResponse {
	authenticated: boolean;

	/** null if not authenticated */
	amountPlaced?: number;
	/** null if not authenticated */
	nextDecoration?: number;
	/** null if not authenticated or never placed one. in JustDate format */
	dateLastPlaced?: number;
}

export interface Decoration {
	/** Longitude (x) */
	[0]: number;
	/** Latitude (y) */
	[1]: number;
	/** DecorationType (index) */
	[2]: number;
}

export interface AddDecorationResponse {
	success: boolean;
	nextDecoration: number;
}

export interface GetAllDecorationsResponse {
	success: boolean;
	decorations: Decoration[];
}

export interface ServerComms {
	getStatus(callback: (res: StatusResponse) => void): void;

	addDecoration(x: number, y: number, when: JustDate, callback: (res: AddDecorationResponse) => void): void;

	getAllDecorations(callback: (res: GetAllDecorationsResponse) => void): void;
}

export class FakeServerComms implements ServerComms {
	getStatus(callback: (res: StatusResponse) => void): void {
		setTimeout(() => {
			callback({
				authenticated: true,
				amountPlaced: 0,
				nextDecoration: 0
			})
		}, 1000)
	}

	addDecoration(x: number, y: number, when: JustDate, callback: (res: AddDecorationResponse) => void): void {
		setTimeout(() => {
			callback({
				success: true,
				nextDecoration: 2
			})
		}, 1000)
	}

	getAllDecorations(callback: (res: GetAllDecorationsResponse) => void): void {
		setTimeout(() => {
			callback({
				success: true,
				decorations: [
					[ 500, 500, 0],
					[ 500, 400, 0],
					[ 200, 500, 0]
				]
			})
		}, 1000)
	}
}




//DEBUG
/*
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
})*/