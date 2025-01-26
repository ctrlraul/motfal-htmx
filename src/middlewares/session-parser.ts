import { TokenHelper } from '../helpers/token-helper';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import { randomUUID } from 'crypto';
import { User } from '../data/user';
import { env } from '../helpers/env';
import { Request, Response, NextFunction } from 'express';


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

	public save(res: Response, data?: Partial<User>) {

		if (data)
			Object.assign(this.user, data);
	
		const token = TokenHelper.createSecretToken(this, secret);

		res.cookie(cookieName, token, {
			maxAge: 1000 * 60 * 60 * 24 * 365,
			httpOnly: true,
		});
	}
}


const secret: Buffer = Buffer.from(env('SESSIONS_SECRET'));
const cookieName = 'session';


async function middleware(req: Request, res: Response, next: NextFunction)
{
	if (cookieName in req.cookies) {
		req.session = TokenHelper.readSecretToken(req.cookies[cookieName], secret);
		req.session.save = Session.prototype.save; // Ew :/
	} else {
		const session = new Session(TokenHelper.generateId());
		session.save(res);
		req.session = session;
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