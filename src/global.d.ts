import { Session } from './middlewares/session-parser.ts';

declare global {
	interface CtxState {
		session: Session;
		log(...args: unknown[]): void;
	}
}