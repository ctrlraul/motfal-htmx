import { Context, Next } from '@oak/oak';
import { TokenHelper } from '../helpers/token-helper.ts';
import { env } from '@raul/env';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { User } from '../data/user.ts';


export class Session {

	public readonly id: string;
	public readonly user: User; // Not so much readonly as we want it to be public get but private set

	constructor (id: string) {
		this.id = id;
		this.user = {
			id: randomUUID(),
			nick: generateNick(),
			acceptedCookies: false,
		};
	}

	public save(ctx: Context<CtxState>, data?: Partial<User>) {

		if (data)
			Object.assign(this.user, data);
	
		const token = TokenHelper.createSecretToken(this, secret);

		ctx.cookies.set(cookieName, token);
	}
}


const secret: Buffer = Buffer.from(env('SESSIONS_SECRET'));
const cookieName = 'session';


async function middleware(ctx: Context<CtxState>, next: Next) {

	const token = await ctx.cookies.get(cookieName);

	if (token) {
		ctx.state.session = TokenHelper.readSecretToken(token, secret);
		ctx.state.session.save = Session.prototype.save; // Ew :/
	} else {
		const session = new Session(TokenHelper.generateId());
		session.save(ctx);
		ctx.state.session = session;
	}

	await next();
}


function generateNick(): string {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		separator: ' ',
		style: 'capital'
	});
}


export const SessionParser = {
	cookieName,
	middleware,
}