import { Room } from '../../../../data/room.ts';
import { objectLength } from '../../../../helpers/object-length.ts';
import { jsx } from 'jsx';


const id = 'users-count';


interface UsersCountProps {
	room: Room;
	swappingExistent?: boolean;
}


export function UsersCount(props: UsersCountProps)
{
	if (props.swappingExistent == undefined)
		props.swappingExistent = true;

	const text = `Participants ( ${getCountString(props.room)} )`;

	if (props.swappingExistent)
	{
		return (
			<span id={id} hx-swap-oob={'outerHTML:#' + id}>
				{text}
			</span>
		);
	}

	return <span id={id}>{text}</span>;
}


function getCountString(room: Room) {
	const usersCount = objectLength(room.users);
	
	if (room.usersLimit == 0)
		return usersCount;

	return usersCount + '/' + room.usersLimit;
}
