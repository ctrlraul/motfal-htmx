import { Context, Next } from '@oak/oak';
import { Logger } from '../helpers/logger.ts';

export async function logFnMiddleware(ctx: Context, next: Next) {
	ctx.state.log = (...args: unknown[]) => Logger.log(ctx.request.url.pathname, ...args);
	await next();
}