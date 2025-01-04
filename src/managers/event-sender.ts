import { User } from '../data/user';
import { SessionParser } from '../middlewares/session-parser';
import { RoomsManager } from '../managers/rooms-manager';
import { Logger } from '../helpers/logger';
import { Router, Response } from 'express';


const logger = new Logger('EventSender');
const targets: Map<User['id'], Response> = new Map();
const router = Router();


router.use(SessionParser.middleware);


router.get('/sse', async (req, res) => {
	const { user } = req.session;
	const target = res;

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	targets.set(user.id, target);

	req.on('close', () => {
		logger.log(user.nick, 'disconnected');
		RoomsManager.notifyUserDisconnected(user);
		targets.delete(user.id);
	});

	logger.log(user.nick, 'connected');
	RoomsManager.notifyUserConnected(user);
});



function send(userId: User['id'], type: string, html: string)
{
	const target = targets.get(userId);

	if (!target)
		return;

	target.write(`event: ${type}\n`);
	target.write(`data: ${html}\n\n`);
}

function sendHtml(userId: User['id'], html: string) {
	targets.get(userId)?.write(html);
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