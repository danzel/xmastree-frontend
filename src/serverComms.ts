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
				authenticated: false,
				amountPlaced: 0,
				nextDecoration: 0
			})
		}, 1000)
	}

	addDecoration(x: number, y: number, when: JustDate, callback: (res: AddDecorationResponse) => void): void {
		setTimeout(() => {
			callback({
				success: false,
				nextDecoration: null
			})
		}, 1000)
	}

	getAllDecorations(callback: (res: GetAllDecorationsResponse) => void): void {
		callback({
			success: true,
			decorations: [[465,579.1875,17],[542,789,20],[336.25,462.25,32],[559.125,569.25,8],[462,571,13],[506,886,34],[460.375,563.75,16],[531.5,579,24],[497.8125,553.0625,2],[457.8125,556.75,15],[442,697,32],[425.8125,563.125,2],[595.5,564,9],[568,424,2],[500,575,18],[500,575,37],[501.375,634.375,21],[553.59375,788.9375,29],[496,696.75,29],[300.52001953125,371.9000244140625,20],[672,861.5,9],[679.5,870.5,13],[516.2197494506836,576.4268131256104,27],[525.7470016479492,715.3584899902344,25],[747.5,368.5,23],[489.1875,572.5,4],[738,573,10],[664.5,215,20],[506,471,18],[325.9375,413.375,9],[458.25,550.125,16],[457.875,542.8125,14],[424,449.5,6],[685.75,478.5,19],[594,555.5,13],[376.5,435.3125,28],[548.375,782.625,18],[577,678,12],[359.375,617.75,1],[687.5,859.5,29],[602.5,563.25,10],[494.5,297,0],[465,902.75,5],[322,371.5,19],[366,735,9],[534.5,864,20],[452.75,536.375,4],[502.1875,565.5,11],[401.5,438.5,10],[509.625,462.75,33],[534.5,900.5,1],[503.125,925,28],[245,879,21],[392.5,514.5,8],[494.125,648.3125,18],[346.875,458.125,30],[490,831,26],[460.125,579.25,14],[494.9375,820.9375,4],[329.0625,469.875,4],[614.875,458.625,5],[665.625,412.9375,3],[451.5,528.5,5],[693.5,846.75,29],[451.75,439.875,5],[538.75,769.75,1],[571.4416272315204,695.9828840533927,4],[491.75,633.25,22],[646.25,603,37],[555.5,694.5,9],[606,483,7],[546.25,766.625,2],[645,453.5,37],[361,610.25,16],[353,311.5,11],[646.5,592.75,17],[495.625,642,12],[666,849,22],[503.3125,939.9375,16],[241,299,24],[323.5,460.5,7],[408.75,574.75,36],[462,688.5,21],[698.75,834.25,21],[649,583,33],[466.5,876,24],[646.5,583.625,18],[541.5,275.5,26],[283.5,878.5,19],[492,654,17],[464.984375,902.78125,6],[534.625,900.4375,5],[323.375,460.5625,8],[518,688,16],[457.5,588,34],[569.5,588.5,6],[621.5,281.5,27],[521.5,222,14],[458.25,596.5,14],[698.40625,834.40625,1],[470.5,543,32],[473.5,917,9],[406.25,271.5,26],[448.5,519.5,5],[546,508,30],[470.5,578.375,11],[383.875,314,17],[266,861,33],[525.5,520.5,35],[661.25,835.25,20],[495,659,36],[496.5,663.5,7],[650,575,14],[677.8125,412.25,19],[701,823,0],[502.0625,297,1],[706.25,320,21],[494.5,542.5,26],[409.5,562.25,35]]
		})
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