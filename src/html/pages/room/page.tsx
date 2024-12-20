import { RoomHeader } from './RoomHeader.tsx';
import { RulesPopup } from '@html/pages/room/rules-popup.tsx';
import { Root } from '../../Root.tsx';
import { LiarView } from '@html/pages/room/liar/liar-view.tsx';
import { GuesserView } from '@html/pages/room/guesser/guesser-view.tsx';
import { Script } from '@html/components/script.tsx';
import path from 'node:path';
import { Room as TRoom } from '../../../data/room.ts';
import { jsx } from 'jsx';
import { Json } from '@html/components/Json.tsx';
import { RoomStarted } from '@html/pages/room/started/view.tsx';

interface RoomProps {
	room: TRoom;
	userId: string;
}

const scriptSrc = path.join(import.meta.dirname!, 'script.js');

export function Room(props: RoomProps)
{
	const { room } = props;

	let View;

	if (room.currentArticle != -1)
		View = <RoomStarted room={room} article={room.articles[room.currentArticle]} />;
	else if (props.userId == room.guesserId)
		View = <GuesserView {...props} />;
	else
		View = <LiarView {...props} />;

	return (
		<Root title='MoþFAL - Room'>
			<Json id='data' data={props} />

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

			<div hidden sse-swap='Kicked' hx-target='#root'></div>
			<div hidden sse-swap='Started' hx-target='#room-view'></div>
			<div hidden sse-swap='Invited' hx-target='main' hx-swap='beforeend'></div>
		</Root>
	);
}
