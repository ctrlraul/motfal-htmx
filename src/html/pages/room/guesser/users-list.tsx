import { jsx, Fragment } from 'jsx';
import { Room } from '../../../../data/room.ts';
import { UsersListItem } from '@html/pages/room/guesser/users-list-item.tsx';
import { UsersCount } from '@html/pages/room/guesser/users-count.tsx';

export function UsersList(props: { room: Room })
{
	const { room } = props;
	const users = Object.values(room.users);

	return (
		<>
			<UsersCount room={room} swappingExistent={false} />

			<ul>
				{users.map(user =>
					<UsersListItem user={user} room={room} />
				)}
				<div hidden sse-swap='AddUsersListItem' hx-swap='beforebegin'></div>
			</ul>
		</>
	);
}