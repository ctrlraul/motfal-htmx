import { Room } from '../../../../data/room';
import { User } from '../../../../data/user';
import { EventSender } from '../../../../managers/event-sender';
import { jsx } from '@jsx';
import * as Icons from '@html/icons';


interface UsersListItem {
	user: User;
	room: Room;
}


const Check = (
	<span style='color: var(--color-accent);'>
		<Icons.Check />
	</span>
);


export function getSwapString(userId: User['id']): string {
	return `UpdateUsersListItem-${userId}`;
}

export function UsersListItem({ user, room }: UsersListItem)
{
	const check = room.articles.find(article => article.userId == user.id);
	const classes: string[] = [];

	if (!EventSender.isConnected(user.id))
		classes.push('disconnected');

	if (user.id === room.guesserId)
		classes.push('guesser');

	return (
		<li class={classes.join(' ')}
			sse-swap={getSwapString(user.id)}
			hx-swap='outerHTML'>
			
			<div>
				<span class='nick'>{user.nick}</span>

				{check ? Check : ''}

				<div class='kick' hx-post={'/kick?id=' + user.id}>
					Kick
				</div>
				
				<span class='guesser-label'>Guesser</span>
			</div>
		</li>
	);
}
