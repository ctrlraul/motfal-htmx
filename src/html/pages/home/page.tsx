import { Style } from '@html/components/Style';
import { Root } from '@html/Root';
import { MainHeader } from '@html/MainHeader';
import { jsx } from '@jsx';
import { NickSection } from '@html/pages/home/NickSection';
import { LoadingSpinner } from '@html/components/LoadingSpinner';
import { User } from '../../../data/user';
import { Enter } from '../../icons';
import css from './style.css';

interface HomeProps {
	user: User;
	joinError?: string;
}

export function Home(props: HomeProps)
{
	return (
		<Root title='MoþFAL - Most of these Folks Are Lying'
			user={props.user}>

			<MainHeader>MoþFAL</MainHeader>

			<main>
				<div class='content g-box'>
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
						hx-trigger='submit'
						hx-indicator='#join-indicator'>

						<input class='g-big'
							type='text'
							id='code'
							name='code'
							placeholder='Go to room'
							required />

						<button class='g-big' type='submit'>
							<Enter />
						</button>
						
						<LoadingSpinner id='join-indicator' style='border-radius: var(--radius-common)' />
					</form>

					<div id="join-error-message">
						{props.joinError}
					</div>
					
					{<NickSection nick={props.user.nick} />}
						
				</div>
			</main>

			<footer hx-get='/rules'
				hx-target='#root'
				hx-swap='outerHTML'
				hx-push-url='true'>
				How to play
			</footer>

			<Style css={css} />
		</Root>
	);
}