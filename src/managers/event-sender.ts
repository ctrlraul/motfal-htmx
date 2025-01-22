import { Router, Request, Response } from 'express';
import { User } from '../data/user';
import { SessionParser } from '../middlewares/session-parser';
import { RoomsManager } from '../managers/rooms-manager';
import { Logger } from '../helpers/logger';

const logger = new Logger('EventSender');
const targets: Map<User['id'], Response> = new Map();
const router = Router();

router.use(SessionParser.middleware);

router.get('/sse', (req: Request, res: Response) =>
{
	const { user } = req.session;

	if (!user) {
		res.status(401).send('Unauthorized');
		return;
	}

	// Set up the SSE connection
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	targets.set(user.id, res);

	req.on('close', () => {
		logger.log(user.nick, 'disconnected');
		RoomsManager.notifyUserDisconnected(user);
		targets.delete(user.id);
	});

	logger.log(user.nick, 'connected');
	RoomsManager.notifyUserConnected(user);
});

function send(userId: User['id'], type: string, html: string) {
	const target = targets.get(userId);
	const data = html.replace(/^(.?)/gm, 'data: $1');

	if (target)
		target.write(`event: ${type}\n${data}\n\n`);
}

function sendHtml(userId: User['id'], html: string) {
	const target = targets.get(userId);
	if (target) {
		target.write(`data: ${html}\n\n`);
	}
}

function isConnected(userId: User['id']) {
	return targets.has(userId);
}

export const EventSender = {
	router,
	send,
	sendHtml,
	isConnected,
};
