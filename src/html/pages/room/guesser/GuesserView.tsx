import { UsersList } from '@html/pages/room/guesser/UsersList';
import { Style } from '@html/components/Style';
import { Room } from '../../../../data/room';
import { jsx, Fragment } from '@jsx';
import { ArticlesCounter } from '@html/pages/room/guesser/ArticlesCounter';
import { StartButton } from '@html/pages/room/guesser/StartButton';
import css from './guesser.css';

export function GuesserView(props: { room: Room })
{
	return (
		<>
			<section class='center'>
				<ArticlesCounter
					room={props.room}
					swappingExistent={false}
				/>
				<StartButton room={props.room} swappingExistent={false} />
			</section>
			
			<section class='users g-box-pop g-foreground'>
				<UsersList room={props.room} />
			</section>

			<section class='invite g-box g-foreground g-round-footer-corners'>
				<span>Invite</span>
				<div>
					<input type='text' id='invite-link'/>
					<button id='copy-invite-button'>Copy</button>
				</div>
			</section>

			<Style css={css} />
		</>
	);
}