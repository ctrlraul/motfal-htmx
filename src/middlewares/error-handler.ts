import { Context, Next, Status } from '@oak/oak';

export async function errorHandler(ctx: Context<CtxState>, next: Next) {
	try {
		await next();
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : error;
		ctx.state.log('Error:', errorMessage);
		console.log(error);
		ctx.response.status = Status.InternalServerError;
	}
}