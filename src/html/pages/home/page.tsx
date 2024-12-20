import path from 'node:path';
import { Style } from '@html/components/style.tsx';
import { Root } from '@html/Root.tsx';
import { MainHeader } from '@html/MainHeader.tsx';
import { jsx } from 'jsx';
import { User } from '../../../data/user.ts';
import { NickSection } from '@html/pages/home/NickSection.tsx';

interface HomeProps {
	user?: User;
}

const styleSrc = path.join(import.meta.dirname!, 'style.css');

export function Home(props: HomeProps)
{
	return (
		<Root title='MoþFAL - Most of these Folks Are Lying'>

			<MainHeader>MoþFAL</MainHeader>

			<main>
				<div class='content std-box'>
					<button class='g-big create'
						hx-get='/make'
						hx-target='#root'
						hx-swap='outerHTML'
						hx-push-url='true'>
						Make new room
					</button>

					<form class='join'
						hx-post='/join'
						hx-target='#root'
						hx-swap='outerHTML'
						hx-trigger='submit'>

						<input class='g-big'
							type='text'
							id='code'
							name='code'
							placeholder='Go to room'
							required />

						<button class='g-big' type='submit'>⎆</button>
					</form>
					
					{props.user ? <NickSection nick={props.user.nick} /> : ''}
						
				</div>
			</main>

			<footer hx-get='/rules'
				hx-target='#root'
				hx-swap='outerHTML'
				hx-push-url='true'>
				How to play
			</footer>

			<Style src={styleSrc} />
		</Root>
	);
}