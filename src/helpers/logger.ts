export class Logger {

	private label: string;

	constructor(label: string) {
		this.label = label;
	}

	public log(...message: unknown[]): void {
		Logger.log(this.label, ...message);
	}

	public static log(label: string, ...message: unknown[]): void {
		console.log(`[${label}]`, ...message);
	}
}