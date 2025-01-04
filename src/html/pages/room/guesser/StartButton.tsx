import { jsx } from '@jsx';
import { Room } from '../../../../data/room';


interface StartButtonProps {
	room: Room;
	swappingExistent?: boolean;
}


const id = 'start-button';


export function StartButton(props: StartButtonProps)
{
	if (props.swappingExistent === undefined)
		props.swappingExistent = true;

	const attributes: Record<string, unknown> = {
		id,
		class: 'start g-big',
		'hx-post': '/start',
		'hx-target': '#room-view',
	};

	if (props.swappingExistent)
		attributes['hx-swap-oob'] = 'outerHTML:#' + id;

	if (props.room.articles.length === 0)
		attributes['disabled'] = true;

	return <button {...attributes}>Start</button>;
}