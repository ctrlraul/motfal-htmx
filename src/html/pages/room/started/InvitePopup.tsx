import { jsx } from 'jsx';
import { Room } from '../../../../data/room.ts';
import { User } from '../../../../data/user.ts';

const css = /*css*/`
@keyframes slideUp {
	from {
		transform: translateY(100%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes slideDown {
	from {
		transform: translateY(0);
		opacity: 1;
	}
	to {
		transform: translateY(100%);
		opacity: 0;
	}
}

#invitePopup {
	position: absolute;
	text-align: center;
	animation: slideUp 200ms ease-out;
	opacity: 1;
	margin-bottom: 0;
	bottom: 5.25rem;
}

#invitePopup.hide {
	animation: slideDown 200ms ease-out;
	opacity: 0;
}`;

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

			<style>{css}</style>
		</div>
		
	)
}