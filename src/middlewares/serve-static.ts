import { Context, Next } from '@oak/oak';
import path from 'node:path';

export function serveStatic(folder: string) {

	const root = path.join(Deno.cwd(), folder);

	return async function(ctx: Context, next: Next) {
		try {
			await ctx.send({ root });
		} catch {
			await next();
		}
	}
}