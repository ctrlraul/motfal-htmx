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
import { WikipediaOrg } from '../articles/domains/wikipedia.org.ts';
import { RoomStarted } from '@html/pages/room/started/view.tsx';
import { NickSection } from '@html/pages/home/NickSection.tsx';


const NICK_LENGTH_MAX = 32;
const ARTICLE_SUGGESTIONS_PER_REQUEST = 16;

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
				max={NICK_LENGTH_MAX}/>

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
	const nick = (form.get('nick') || '').slice(0, NICK_LENGTH_MAX);

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
	const previousRoom = RoomsManager.getUserRoom(user.id);

	const ruleAnyNamespace = form.get('any-namespace-checkbox') == 'on';
	const rulePreserveTitleStyle = form.get('preserve-title-style-checkbox') === 'on';
	const invitePreviousRoom = form.get('invite') === 'on';
	const usersLimit = form.get('users-limit-checkbox') === 'on'
		? parseInt(form.get('users-limit-input')!) || 0
		: 0;

	if (usersLimit !== 0 && usersLimit < 3)
		throw new Error(`Invalid users limit: ${usersLimit}`);

	const room = RoomsManager.createRoom(
		user,
		ruleAnyNamespace,
		rulePreserveTitleStyle,
		usersLimit
	);

	if (previousRoom != null)
	{
		RoomsManager.removeUserFromRoom(previousRoom, user.id);

		if (invitePreviousRoom && previousRoom.currentArticle != -1)
			RoomsManager.inviteToNewRoom(previousRoom, user, room);
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

	const articles = await WikipediaOrg.getRandomArticles(ARTICLE_SUGGESTIONS_PER_REQUEST, [
		0 // Main namespace (articles)
	]);

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		articles.map(article =>
			<SuggestionsListItem title={article.title} />
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

	const articleData = await ArticlesHelper.get(link);

	RoomsManager.addArticleToUserInRoom(room, user.id, articleData);

	ctx.response.type = 'text/html';
	ctx.response.body = render(
		<ArticleSubmitted room={room} articleData={articleData} />
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