import { UsersCount } from '@html/pages/room/guesser/UsersCount.tsx';
import { jsx, Fragment, render } from 'jsx';
import { Article } from '../data/article.ts';
import { Room } from '../data/room.ts';
import { User } from '../data/user.ts';
import { Logger } from '../helpers/logger.ts';
import { objectLength } from '../helpers/object-length.ts';
import randomString from '../helpers/random-string.ts';
import { getSwapString, UsersListItem } from '@html/pages/room/guesser/UsersListItem.tsx';
import { EventSender } from './event-sender.ts';
import { ArticlesCounter } from '@html/pages/room/guesser/ArticlesCounter.tsx';
import { Home } from '@html/pages/home/Page.tsx';
import { RoomStarted } from '@html/pages/room/started/StartedView.tsx';
import { StartButton } from '@html/pages/room/guesser/StartButton.tsx';
import { InvitePopup } from '@html/pages/room/started/InvitePopup.tsx';


const logger = new Logger('RoomsManager');
const rooms: Map<string, Room> = new Map();


function notifyUserConnected(user: User): void {
	
	const room = getUserRoom(user.id);

	if (room == null)
		return;

	const swapString = getSwapString(user.id);
	const html = render(
		<UsersListItem user={user} room={room} />
	);

	EventSender.send(room.guesserId, swapString, html);
}

function notifyUserDisconnected(user: User): void {

	const room = getUserRoom(user.id);

	if (room == null)
		return;

	if (room.currentArticle != -1)
		return;
	
	const swapString = getSwapString(user.id);
	const html = render(
		<UsersListItem user={user} room={room} />
	);

	EventSender.send(room.guesserId, swapString, html);
}


function createRoom(
	guesser: User,
	domainName: string,
	rules: Room['rules'],
	usersLimit: number): Room
{
	const room: Room = {
		id: findAvailableRoomId(),
		guesserId: guesser.id,
		domainName,
		rules,
		usersLimit,
		articles: [],
		creationTime: Date.now(),
		currentArticle: -1,
		users: { [guesser.id]: guesser },
		kicked: []
	};

	rooms.set(room.id, room);

	logger.log(`Room created (${room.id})`);

	return room;
}

function getRoom(roomId: string): Room | null {
	return rooms.get(roomId) || null;
}

function getUserRoom(userId: User['id']): Room | null {

	for (const room of rooms.values()) {
		if (userId in room.users)
			return room;
	}

	return null;

}

function addUserToRoom(room: Room, user: User): void {
	
	logger.log(`Adding user '${user.nick}' to room '${room.id}'`);

	room.users[user.id] = user;

	const html = render(
		<>
			<UsersCount room={room} />
			<UsersListItem user={user} room={room} />
		</>
	);

	EventSender.send(room.guesserId, 'AddUsersListItem', html);
}

function removeUserFromRoom(room: Room, userId: User['id']): void
{
	const user = room.users[userId];

	if (!user)
		throw new Error(`No user with id '${userId}' in room '${room.id}'`)

	logger.log(`Removing user (${user.id}) from room (${room.id})`);

	// Don't notify if room is already started
	const shouldNotifyOthers = room.currentArticle === -1;

	delete room.users[user.id];

	if (objectLength(room.users) === 0 || user.id === room.guesserId)
	{
		if (shouldNotifyOthers && user.id === room.guesserId)
		{
			const html = render(<Home user={user} />);
			emitToRoom(room, 'Kicked', html);
		}

		deleteRoom(room.id);
		return;
	}

	room.articles = room.articles.filter(article => article.userId != user.id);

	if (shouldNotifyOthers)
	{
		const html = render(
			<>
				<StartButton room={room} />
				<ArticlesCounter room={room} />
				<UsersCount room={room} />
			</>
		);
	
		EventSender.send(room.guesserId, getSwapString(user.id), html);
	}
}

function isUserInRoom(room: Room, userId: User['id']): boolean {
	return userId in room.users;
}

function kickUserFromRoom(room: Room, userId: User['id'])
{
	if (room.kicked.includes(userId))
		return;

	const user = room.users[userId];

	if (!user)
		return;

	removeUserFromRoom(room, user.id);

	room.kicked.push(user.id);
	
	const html = render(<Home user={user} />);
	EventSender.send(user.id, 'Kicked', html);
}

function addArticleToUserInRoom(room: Room, userId: User['id'], article: Article): void {

	const user = findUserInRoom(room, userId);
	if (!user)
		throw new Error('User not in room');

	article.userId = userId;
	room.articles.push(article);

	const swapString = getSwapString(user.id);
	const html = render(
		<>
			<StartButton room={room} />
			<ArticlesCounter room={room} />
			<UsersListItem user={user} room={room} />
		</>
	);

	EventSender.send(room.guesserId, swapString, html);
}

function startRoom(requestedByUserId: User['id'], room: Room) {

	if (requestedByUserId != room.guesserId) // Only the guesser can start
		throw new Error('Only the guesser can start');

	if (room.articles.length == 0)
		throw new Error('No articles submitted');

	if (room.currentArticle != -1)
		throw new Error('Already started');

	logger.log('Starting room', room.id);

	room.currentArticle = Math.floor(Math.random() * room.articles.length);

	const article = room.articles[room.currentArticle];
	const html = render(<RoomStarted article={article} room={room} />);

	// Guesser's ui is updated when they click the button, so no need to notify them
	emitToRoomExcept(room, 'Started', html, [room.guesserId]);
}

function indexRooms() {
	return rooms;
}

function inviteToNewRoom(fromRoom: Room, fromUser: User, toRoom: Room): void
{
	const html = render(<InvitePopup user={fromUser} room={toRoom} />);
	emitToRoom(fromRoom, 'Invited', html);
}

function deleteRoom(roomId: Room['id']): void {
	logger.log(`Deleting room (${roomId})`);
	rooms.delete(roomId);
}

function emitToRoom(room: Room, eventName: string, html: string): void {
	for (const userId in room.users)
		EventSender.send(userId, eventName, html);
}

function emitToRoomExcept(room: Room, eventName: string, html: string, exceptionIds: User['id'][]): void {
	for (const userId in room.users)
	{
		if (exceptionIds.includes(userId))
			continue;

		EventSender.send(userId, eventName, html);
	}
}

function findAvailableRoomId(): string {

	const charset = '0123456789';

	let length = 2;
	let id = randomString(length, charset);

	while (id in rooms) {
		length++;
		id = randomString(length, charset);
	}

	return id;
}

function findUserInRoom(room: Room, userId: User['id']): User {
	return room.users[userId];
}


export const RoomsManager = {
	notifyUserConnected,
	notifyUserDisconnected,
	createRoom,
	getRoom,
	getUserRoom,
	addUserToRoom,
	removeUserFromRoom,
	isUserInRoom,
	kickUserFromRoom,
	addArticleToUserInRoom,
	startRoom,
	indexRooms,
	inviteToNewRoom,
};
