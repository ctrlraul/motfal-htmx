export {};

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: {
				hidden?: boolean;
				[key: string]: unknown;
			};
		}
	}
}