export {};

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: unknown; // Just allow any element with any attributes
		}
	}
}