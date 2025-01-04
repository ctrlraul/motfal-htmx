import { Root } from '@html/Root';
import { MainHeader } from '@html/MainHeader';
import { Style } from '@html/components/Style';
import { jsx } from '@jsx';
import { Room } from '../../../data/room';
import { ArticlesHelper } from '../../../articles/articles-helper';
import { LoadingSpinner } from '@html/components/LoadingSpinner';
import { User } from '../../../data/user';
import css from './style.css';


interface MakeRoomProps {
	currentRoom?: Room | null;
	user: User;
}


const limitUsers = false;


export function MakeRoom(props: MakeRoomProps)
{
	return (
		<Root title='MoþFAL - Make Room' user={props.user}>
			<MainHeader>Make Room</MainHeader>

			<main>
				<DomainsSection />
				<RulesSection />
			
				{props.currentRoom ? (
					<div class='g-box-pop g-foreground'>
						<label class='option'>
							<input type='checkbox' name='invite' checked />
							Invite previous room
						</label>
					</div>
				) : ''}

				<button class='make g-big'
					hx-post='/make'
					hx-target='#root'
					hx-swap='outerHTML'
					hx-include='input'
					hx-push-url='true'
					hx-indicator='#make-indicator'>
					Make
				</button>

				<LoadingSpinner id='make-indicator' />
			</main>

			<footer>
				<div hx-get='/'
					hx-target='#root'
					hx-swap='outerHTML'
					hx-push-url='true'>
					Cancel
				</div>
			</footer>

			<Style css={css} />
		</Root>
	);
}


function DomainsSection()
{
	// fight me bro
	const onclick = `
		document.querySelectorAll('[data-domain]').forEach(x => x.hidden = true);
		document.querySelectorAll('[data-domain="%domain%"]').forEach(x => x.hidden = false);
	`;

	return (
		<section class='domains g-box-pop g-foreground'>
			<div class='header'>Domain</div>

			<div class='items'>
				{ArticlesHelper.getDomains().map((domain, i) => (
					<label class='option' onclick={onclick.replace('%domain%', domain.name)}>
						<input type='radio' name='domain' value={domain.name} checked={!i || undefined} />
						{domain.name}
					</label>
				))}
			</div>
		</section>
	);
}


function RulesSection()
{
	return (
		<section class='rules g-box-pop g-foreground'>

			<div class='header'>Rules</div>
			
			<div class='items'>
				<div class='checkboxes'>
					{ArticlesHelper.getDomains().map((domain, i) => 
						domain.ruleSet.map(rule => (
							<div data-domain={domain.name} hidden={!!i || undefined}>
								<label class='option'>
									<input type='checkbox' name={domain.name + '-' + rule.id} checked={rule.defaultValue} />
									{rule.name}
								</label>
							</div>
						))
					)}
				</div>

				<div class='g-hr'></div>

				<div class='limit-container'>
					<label class='option'>
						<input type='checkbox'
							name='limit-users'
							onclick='limitInput.hidden = !this.checked'
							checked={limitUsers || undefined} />
						
						Participants limit
					</label>

					<input id='limitInput'
						type='number'
						name='users-limit'
						value={4}
						min={3}
						max={40}
						step={1}
						hidden={!limitUsers} />
				</div>
			</div>
		</section>
	);
}