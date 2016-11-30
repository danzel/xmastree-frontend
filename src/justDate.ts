export class JustDate {
	/** value is in format l.getFullYear() * 10000 + (l.getMonth() + 1) * 100 + l.getDate() */
	constructor(public value: number) {
	}

	getFullYear() {
		return Math.floor(this.value / 10000);
	}

	getMonthZeroBased() {
		return (Math.floor(this.value / 100) % 100) - 1;
	}

	getDate() {
		return this.value % 100;
	}

	asDate() {
		return new Date(this.getFullYear(), this.getMonthZeroBased(), this.getDate());
	}

	static create(year: number, monthZeroBased: number, dayOfMonth: number) {
		return new JustDate(year * 10000 + (monthZeroBased + 1) * 100 + dayOfMonth);
	}

	static now() {
		let now = new Date();
		return JustDate.create(now.getFullYear(), now.getMonth(), now.getDate());
	}
}