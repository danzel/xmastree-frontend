import { JustDate } from './justDate';

//export const serverBaseUrl = 'http://localhost:3000';
export const serverBaseUrl = 'https://api.xmastree.io';

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
	getStatus(callback: (err: Error, res: StatusResponse) => void): void;

	addDecoration(x: number, y: number, when: JustDate, callback: (res: AddDecorationResponse) => void): void;

	getAllDecorations(callback: (res: GetAllDecorationsResponse) => void): void;
}

export class FakeServerComms implements ServerComms {
	getStatus(callback: (err: Error, res: StatusResponse) => void): void {
		setTimeout(() => {
			callback(null, {
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
					[500, 500, 0],
					[500, 400, 0],
					[200, 500, 0]
				]
			})
		}, 1000)
	}
}

export class RealServerComms implements ServerComms {
	getStatus(callback: (err: Error, res: StatusResponse) => void): void {
		$.ajax({
			method: 'GET',
			url: serverBaseUrl + '/api/status/v1',
			xhrFields: {
				withCredentials: true
			}
		}).done(res => {
			callback(null, res);
		}).fail((err: Error) => {
			callback(err, null);
		})
	}

	addDecoration(x: number, y: number, when: JustDate, callback: (res: AddDecorationResponse) => void): void {
		$.ajax({
			method: 'POST',
			url: serverBaseUrl + '/api/decorations/add/v1',
			xhrFields: {
				withCredentials: true
			},
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({
				x,
				y,
				date: when.value
			}),
		}).done(res => {
			callback({
				success: true,
				nextDecoration: res.nextDecoration
			})
		}).fail(err => {
			console.log(err)
			callback({
				success: false,
				nextDecoration: null
			})
		})
	}

	getAllDecorations(callback: (res: GetAllDecorationsResponse) => void): void {
		$.ajax({
			method: 'GET',
			url: serverBaseUrl + '/api/decorations/v1',
			xhrFields: {
				withCredentials: true
			}
		}).done(res => {
			callback({
				decorations: res.decorations,
				success: true
			})
		}).fail((err: Error) => {
			console.log(err)
			callback({
				success: false,
				decorations: null
			});
		})
	}
}