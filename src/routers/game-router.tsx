import { Router, Status } from '@oak/oak';
import { Home } from '@html/pages/home/page.tsx';
import { Rules } from '@html/pages/rules/page.tsx';
import { MakeRoom } from '../html/pages/make/page.tsx';
import { RoomsManager } from '../managers/rooms-manager.tsx';
import { Session, SessionParser } from '../middlewares/session-parser.ts';
import { SuggestionsListItem } from '@html/pages/room/liar/suggestions-list-item.tsx';
import { ArticleSubmitted } from '@html/pages/room/liar/ArticleSubmitted.tsx';
import { Room } from '@html/pages/room/page.tsx';
import { ArticlesHelper } from '../articles/articles-helper.ts';
import { jsx, render } from 'jsx';
import { RoomStarted } from '@html/pages/room/started/view.tsx';
import { NickSection } from '@html/pages/home/NickSection.tsx';


const NickLengthMax = 32;
const ArticlesPerRequest = 16;

const router = new Router<{
	session: Session,
	log: (...args: unknown[]) => void
}>();


router.use(SessionParser.middleware);


router.get('/', ctx => {

	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (room) {
		ctx.response.redirect('/room');
		return;
	}

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		<Home user={user} />
	);
});

router.get('/nick-change', ctx => {
	ctx.response.type = 'text/html';
	ctx.response.body = render(
		<form id='nick'
			hx-post='/nick-change'
			hx-swap='outerHTML'
			hx-trigger='submit'>

			<input type='text'
				name='nick'
				placeholder='New nick'
				value={ctx.state.session.user.nick}
				max={NickLengthMax}/>

			<button class='cancel' type='submit'>
				Cancel
			</button>

			<button class='ok' type='submit'>
				Ok
			</button>
		</form>
	);
});

router.post('/nick-change', async ctx => {
	
	const { user } = ctx.state.session;
	const form = await ctx.request.body.form();
	const nick = (form.get('nick') || '').slice(0, NickLengthMax);

	if (nick != '' && nick != user.nick)
		ctx.state.session.save(ctx, { nick });

	ctx.response.type = 'text/html';
	ctx.response.body = render(<NickSection nick={user.nick} />);
});

router.get('/rules', ctx => {
	ctx.response.type = 'text/html';
	ctx.response.body = render(<Rules/>);
});

router.get('/make', ctx => {
	const { user } = ctx.state.session;
	const currentRoom = RoomsManager.getUserRoom(user.id);
	ctx.response.type = 'text/html';
	ctx.response.body = render(<MakeRoom currentRoom={currentRoom} />);
});

router.post('/make', async ctx => {

	const { user } = ctx.state.session;
	const form = await ctx.request.body.form();

	const domainName = form.get('domain');
	const limitUsers = form.get('limit-users') === 'on';
	const usersLimit = parseInt(String(form.get('users-limit'))) || 0;
	const invite     = form.get('invite') === 'on';

	if (!ArticlesHelper.isDomainRegistered(domainName))
	{
		ctx.response.status = Status.BadRequest;
		ctx.response.body = 'Invalid domain';
		return;
	}

	if (limitUsers && usersLimit < 3)
	{
		ctx.response.status = Status.BadRequest;
		ctx.response.body = 'Invalid users limit';
		return;
	}

	const rules = ArticlesHelper.createRules(domainName!, form);
	const oldRoom = RoomsManager.getUserRoom(user.id);
	const newRoom = RoomsManager.createRoom(user, domainName!, rules, usersLimit);

	if (oldRoom)
	{
		RoomsManager.removeUserFromRoom(oldRoom, user.id);

		if (invite && oldRoom.currentArticle != -1)
			RoomsManager.inviteToNewRoom(oldRoom, user, newRoom);
	}
	
	ctx.response.redirect('/room');
});

router.get('/room', ctx => {

	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (room == null) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		<Room room={room} userId={user.id} />
	);
});

router.post('/join', async ctx => {
	
	const form = await ctx.request.body.form();
	const code = form.get('code');
	const id = String(code || '').split('/').pop();
	
	if (!id) {
		ctx.state.log(ctx.state.session.user.nick, '-> Invalid code:', code);
		ctx.response.redirect('/');
		return;
	}

	ctx.response.redirect('/join/' + id);
});

router.get('/join/:id', ctx => {
	
	const { user } = ctx.state.session;
	const currentRoom = RoomsManager.getUserRoom(user.id);
	const roomId = ctx.params.id;

	if (currentRoom) {

		if (currentRoom.id == roomId) {
			ctx.response.redirect('/room');
			return;
		}

		RoomsManager.removeUserFromRoom(currentRoom, user.id);
	}

	const room = RoomsManager.getRoom(roomId);

	if (!room) { // Room not found page?
		ctx.state.log(user.nick, '-> No room with id:', roomId);
		ctx.response.redirect('/');
		return;
	}

	if (room.kicked.includes(user.id)) {
		ctx.response.redirect('/');
		return;
	}

	RoomsManager.addUserToRoom(room, user);

	ctx.response.redirect('/room');

});

router.get('/suggestions', async ctx => {

	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);
	
	if (!room) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}

	const articleInfos = await ArticlesHelper.getRandomArticles(
		room.domainName,
		ArticlesPerRequest,
		room.rules
	);

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		articleInfos.map(info =>
			<SuggestionsListItem {...info} />
		)
	);
});

router.post('/kick', ctx =>
{
	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (!room) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}

	if (user.id !== room.guesserId)
	{
		ctx.state.log(user.nick, '-> Only the guesser can kick');
		ctx.response.redirect('/');
		return;
	}

	const kickId = ctx.request.url.searchParams.get('id') || '';

	if (!RoomsManager.isUserInRoom(room, kickId))
	{
		ctx.state.log(user.nick, '-> User not found');
		ctx.response.redirect('/');
		return;
	}

	RoomsManager.kickUserFromRoom(room, kickId);

	ctx.response.status = Status.OK;

});

router.post('/submit', async ctx => {

	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);
	const form = await ctx.request.body.form();

	if (!room) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}
	
	if (room.articles.find(article => article.userId == user.id))
		throw new Error('Already submitted an article');

	const link = form.get('link');

	if (!link)
		throw new Error('Link can\'t be empty');

	const article = await ArticlesHelper.getArticle(room.domainName, link);

	RoomsManager.addArticleToUserInRoom(room, user.id, article);

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		<ArticleSubmitted room={room} article={article} />
	);
});

router.post('/leave', ctx => {
	
	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);

	if (!room) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}

	RoomsManager.removeUserFromRoom(room, user.id);

	ctx.response.redirect('/');

});

router.post('/start', ctx => {

	const { user } = ctx.state.session;
	const room = RoomsManager.getUserRoom(user.id);
	
	if (!room) {
		ctx.state.log(user.nick, '-> Not in a room');
		ctx.response.redirect('/');
		return;
	}

	RoomsManager.startRoom(user.id, room);
	
	const article = room.articles[room.currentArticle];

	ctx.response.type = 'text/html';
	ctx.response.body = render(<RoomStarted article={article} room={room} />);
});


export {
	router
}