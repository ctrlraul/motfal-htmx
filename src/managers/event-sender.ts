import { Router, ServerSentEvent, ServerSentEventTarget } from '@oak/oak';
import { User } from '../data/user.ts';
import { SessionParser } from '../middlewares/session-parser.ts';
import { RoomsManager } from '../managers/rooms-manager.tsx';
import { Logger } from '../helpers/logger.ts';


const logger = new Logger('EventSender');
const targets: Map<User['id'], ServerSentEventTarget> = new Map();
const router = new Router<CtxState>();


router.use(SessionParser.middleware);


router.get('/sse', async ctx => {

	const { user } = ctx.state.session;
	const target = await ctx.sendEvents();

	targets.set(user.id, target);

	target.addEventListener('close', () => {
		logger.log(user.nick, 'disconnected');
		RoomsManager.notifyUserDisconnected(user);
	});

	logger.log(user.nick, 'connected');
	RoomsManager.notifyUserConnected(user);

});


function send(userId: User['id'], type: string, html: string) {
	const sse = new ServerSentEvent(type, { data: html });
	targets.get(userId)?.dispatchEvent(sse);
}

function sendHtml(userId: User['id'], html: string) {
	targets.get(userId)?.dispatchMessage(html);
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