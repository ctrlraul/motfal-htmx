import { jsx } from '@jsx';
import { Room } from '../../../../data/room';
import { User } from '../../../../data/user';
import { Style } from '@html/components/Style';
import css from './invite.css';


export function InvitePopup(props: { user: User, room: Room })
{
	return (
		<div id='invitePopup' class="g-box-pop g-foreground">

			<span style='color: var(--color-accent)'>
				{props.user.nick + ' '}
			</span>

			<span>invited you to room</span>

			<span style='color: var(--color-accent)'>
				{' ' + props.room.id}
			</span>

			<div>
				Domain:
				<span style='color: var(--color-accent)'>
					{' ' + props.room.domainName}
				</span>
			</div>

			<div style='display: flex; margin-top: 0.5rem'>
				<button class='g-big'
					style='width: 40%'
					onclick='
						invitePopup.classList.add("hide");
						setTimeout(() => invitePopup.remove(), 200);
					'>{/* Wild */}
					Reject
				</button>

				<div style='flex: 1;'></div>

				<button class='g-big'
					style='width: 40%'
					hx-get={'/join/' + props.room.id}
					hx-target='#root'
					hx-swap='outerHTML'
					hx-replace-url='true'>
					Join
				</button>
			</div>

			<Style css={css} />
		</div>
		
	)
}