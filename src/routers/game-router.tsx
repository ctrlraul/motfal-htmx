import { Router, urlencoded } from 'express';
import { Home } from '@html/pages/home/Page';
import { Rules } from '@html/pages/rules/page';
import { MakeRoom } from '@html/pages/make/Page';
import { RoomsManager } from '../managers/rooms-manager';
import { SessionParser } from '../middlewares/session-parser';
import { SuggestionsListItem } from '@html/pages/room/liar/SuggestionsListItem';
import { ArticleSubmitted } from '@html/pages/room/liar/ArticleSubmitted';
import { Room } from '@html/pages/room/Page';
import { ArticlesHelper } from '../articles/articles-helper';
import { jsx, render } from '@jsx';
import { RoomStarted } from '@html/pages/room/started/StartedView';
import { NickSection } from '@html/pages/home/NickSection';


const NickLengthMax = 32;
const ArticlesPerRequest = 16;

const router = Router();


router.use(urlencoded({ extended: true }));
router.use(SessionParser.middleware);


router.get('/', (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (room) {
		res.redirect('/room');
		return;
	}

	res.type('text/html');
	res.send(render(
		<Home user={user} />
	));
});

router.post('/cookies/accept', (req, res) => {
	req.session.save(res, { acceptedCookies: true });
	res.type('text/html');
	res.send();
});

router.post('/cookies/reject', (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (room)
		RoomsManager.removeUserFromRoom(room, user.id);

	res.clearCookie(SessionParser.cookieName);
	res.header('Hx-Redirect', 'https://www.google.com/');
});

router.get('/nick-change', (req, res) => {
	res.type('text/html');
	res.send(render(
		<form id='nick'
			hx-post='/nick-change'
			hx-swap='outerHTML'
			hx-trigger='submit'>

			<input type='text'
				name='nick'
				placeholder='New nick'
				value={req.session.user.nick}
				max={NickLengthMax}/>

			<button class='cancel' type='submit'>
				Cancel
			</button>

			<button class='ok' type='submit'>
				Ok
			</button>
		</form>
	));
});

router.post('/nick-change', async (req, res) => {
	
	const { user } = req.session;
	const nick = String(req.body['nick'] || '').slice(0, NickLengthMax);

	if (nick != '' && nick != user.nick)
		req.session.save(res, { nick });

	res.type('text/html');
	res.send(render(<NickSection nick={user.nick} />));
});

router.get('/rules', (req, res) => {
	res.type('text/html');
	res.send(render(<Rules user={req.session.user}/>));
});

router.get('/make', (req, res) => {
	const { user } = req.session;
	const currentRoom = RoomsManager.getUserRoom(user.id);
	res.type('text/html');
	res.send(render(<MakeRoom currentRoom={currentRoom} user={user} />));
});

router.post('/make', async (req, res) => {

	const { user } = req.session;

	const domainName = req.body['domain'];
	const limitUsers = req.body['limit-users'] === 'on';
	const usersLimit = parseInt(String(req.body['users-limit'])) || 0;
	const invite     = req.body['invite'] === 'on';

	if (!ArticlesHelper.isDomainRegistered(domainName))
	{
		res.status(404);
		res.send('Invalid domain');
		return;
	}

	if (limitUsers && usersLimit < 3)
	{
		res.status(404);
		res.send('Invalid users limit');
		return;
	}

	const rules = ArticlesHelper.createRules(domainName!, req.body);
	const oldRoom = RoomsManager.getUserRoom(user.id);
	const newRoom = RoomsManager.createRoom(user, domainName!, rules, limitUsers ? usersLimit : 0);

	if (oldRoom)
	{
		RoomsManager.removeUserFromRoom(oldRoom, user.id);

		if (invite && oldRoom.currentArticle != -1)
			RoomsManager.inviteToNewRoom(oldRoom, user, newRoom);
	}
	
	res.redirect('/room');
});

router.get('/room', (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (room == null) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}

	res.type('text/html');
	res.send(render(
		<Room room={room} user={user} />
	));
});

router.post('/join', async (req, res) => {
	
	const code = req.body['code'];
	const id = String(code || '').split('/').pop();
	
	if (!id) {
		console.log(`[${req.path}]`, req.session.user.nick, '-> Invalid code:', code);
		res.redirect('/');
		return;
	}

	res.redirect('/join/' + id);
});

router.get('/join/:id', (req, res) => {
	
	const { user } = req.session;
	const currentRoom = RoomsManager.getUserRoom(user.id);
	const roomId = req.params.id;

	if (currentRoom) {

		if (currentRoom.id == roomId) {
			res.redirect('/room');
			return;
		}

		RoomsManager.removeUserFromRoom(currentRoom, user.id);
	}

	const room = RoomsManager.getRoom(roomId);

	if (!room) { // Room not found page?
		console.log(`[${req.path}]`, user.nick, '-> No room with id:', roomId);
		res.redirect('/');
		return;
	}

	if (room.kicked.includes(user.id)) {
		res.redirect('/');
		return;
	}

	RoomsManager.addUserToRoom(room, user);

	res.redirect('/room');

});

router.get('/suggestions', async (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);
	
	if (!room) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}

	const articleInfos = await ArticlesHelper.getRandomArticles(
		room.domainName,
		ArticlesPerRequest,
		room.rules
	);

	res.type('text/html');
	res.send(render(
		articleInfos.map(info =>
			<SuggestionsListItem {...info} />
		)
	));
});

router.post('/kick', (req, res) =>
{
	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (!room) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}

	if (user.id !== room.guesserId)
	{
		console.log(`[${req.path}]`, user.nick, '-> Only the guesser can kick');
		res.redirect('/');
		return;
	}

	const kickId = String(req.query['id']) || '';

	if (!RoomsManager.isUserInRoom(room, kickId))
	{
		console.log(`[${req.path}]`, user.nick, '-> User not found');
		res.redirect('/');
		return;
	}

	RoomsManager.kickUserFromRoom(room, kickId);

	res.status(200);

});

router.post('/submit', async (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (!room) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}
	
	if (room.articles.find(article => article.userId == user.id))
		throw new Error('Already submitted an article');

	const link = req.body['link'];

	if (!link)
		throw new Error('Link can\'t be empty');

	const article = await ArticlesHelper.getArticle(room.domainName, link);

	RoomsManager.addArticleToUserInRoom(room, user.id, article);

	res.type('text/html');
	res.send(render(
		<ArticleSubmitted room={room} article={article} />
	));
});

router.post('/leave', (req, res) => {
	
	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (!room) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}

	RoomsManager.removeUserFromRoom(room, user.id);

	res.redirect('/');

});

router.post('/start', (req, res) => {

	const { user } = req.session;
	const room = RoomsManager.getUserRoom(user.id);
	
	if (!room) {
		console.log(`[${req.path}]`, user.nick, '-> Not in a room');
		res.redirect('/');
		return;
	}

	RoomsManager.startRoom(user.id, room);
	
	const article = room.articles[room.currentArticle];

	res.type('text/html');
	res.send(render(
		<RoomStarted article={article} room={room} />
	));
});


export {
	router
}