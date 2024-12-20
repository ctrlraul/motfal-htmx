import { Root } from '@html/Root.tsx';
import { MainHeader } from '@html/MainHeader.tsx';
import path from 'node:path';
import { Style } from '@html/components/style.tsx';
import { jsx } from 'jsx';
import { Room } from '../../../data/room.ts';

interface MakeRoomProps {
	currentRoom?: Room | null;
}

export function MakeRoom(props: MakeRoomProps)
{
	const styleSrc = path.join(import.meta.dirname!, 'style.css');

	return (
		<Root title='MoþFAL - Make Room'>
			<MainHeader>Make Room</MainHeader>

			<main>
				<div style='text-align: center; margin-bottom: 0.5rem'>
					Options
				</div>
			
				<div class='std-box-pop g-foreground'>
					<label>
						<input type='checkbox' name='any-namespace-checkbox' checked disable />
						Allow articles in any namespace
					</label>
					
					<label>
						<input type='checkbox' name='preserve-title-style-checkbox' checked />
						Preserve article title style
					</label>

					<div class='g-hr'></div>

					<div style='display: flex; align-items: center;'>
						<label style='flex: 1;'>
							<input type='checkbox' name='users-limit-checkbox' />
							Participants limit
						</label>
						<input type='number' name='users-limit-input' value='4' min='3' step='1' style='width: 3rem;' />
					</div>
				</div>
			
				{props.currentRoom ? (
					<div class='std-box-pop g-foreground'>
						<label>
							<input type='checkbox' name='invite' checked />
							Invite previous room
						</label>
					</div>
				) : ''}

				<button class='g-big'
					hx-post='/make'
					hx-target='#root'
					hx-swap='outerHTML'
					hx-include='input'
					hx-push-url='true'>
					Create
				</button>
			</main>

			<footer>
				<div hx-get='/'
					hx-target='#root'
					hx-swap='outerHTML'
					hx-push-url='true'>
					Cancel
				</div>
			</footer>

			<Style src={styleSrc} />
		</Root>
	);
}