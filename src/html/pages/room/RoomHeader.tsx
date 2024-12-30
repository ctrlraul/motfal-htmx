import { jsx } from 'jsx';
import { Room } from '../../../data/room.ts';
import * as Icons from '@html/icons.tsx';

export interface RoomHeaderProps {
	room: Room;
}

export function RoomHeader(props: RoomHeaderProps) {
	return (
		<header class='g-box g-foreground g-round-header-corners' style='display: flex;'>

			<div style='flex: 1;'>
				<div style='font-weight: 700;'>
					Room 
					<span style='color: var(--color-accent); opacity: 0.8;'>
						{' ' + props.room.id} ({props.room.domainName})
					</span>
				</div>

				<div style='font-size: 85%;'>
					Created <span id='time'>X seconds ago</span>
				</div>
			</div>

			<button style='width: 2.5em;'
				hx-post='/leave'
				hx-target='#root'
				hx-swap='outerHTML'
				hx-replace-url='true'>
				<Icons.Exit style='width: 1.25rem; height: 1.25rem;' />
			</button>

		</header>
	);
}
