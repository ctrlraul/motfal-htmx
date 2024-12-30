import { RoomHeader } from '@html/pages/room/RoomHeader.tsx';
import { Root } from '@html/Root.tsx';
import { LiarView } from '@html/pages/room/liar/LiarView.tsx';
import { GuesserView } from '@html/pages/room/guesser/GuesserView.tsx';
import { Script } from '@html/components/Script.tsx';
import path from 'node:path';
import { Room as TRoom } from '../../../data/room.ts';
import { jsx } from 'jsx';
import { Json } from '@html/components/Json.tsx';
import { RoomStarted } from '@html/pages/room/started/StartedView.tsx';
import { RulesPopup } from '@html/pages/room/RulesPopup.tsx';
import { User } from '../../../data/user.ts';

interface RoomProps {
	room: TRoom;
	user: User;
}

const scriptSrc = path.join(import.meta.dirname!, 'script.js');

export function Room(props: RoomProps)
{
	const { room, user } = props;

	const dataForClient = {
		roomId: room.id,
		roomCreationTime: room.creationTime,
		isGuesser: user.id === room.guesserId,
	};

	let View;

	if (room.currentArticle != -1)
		View = <RoomStarted room={room} article={room.articles[room.currentArticle]} />;
	else if (props.user.id == room.guesserId)
		View = <GuesserView {...props} />;
	else
		View = <LiarView {...props} />;

	return (
		<Root title='MoþFAL - Room' user={user}>
			<Json id='data' data={dataForClient} />

			<RoomHeader {...props} />

			<main>
				<button class='rules' hx-on:click='rulesPopup.hidden = false'>
					Rules
				</button>

				<div id='room-view'>
					{View}
				</div>
			</main>

			<RulesPopup {...props} />

			<Script src={scriptSrc} />

			<div hidden sse-swap='Kicked' hx-target='#root' hx-swap='outerHTML'></div>
			<div hidden sse-swap='Started' hx-target='#room-view'></div>
			<div hidden sse-swap='Invited' hx-target='main' hx-swap='beforeend'></div>
		</Root>
	);
}
