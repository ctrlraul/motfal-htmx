import { Root } from '@html/Root.tsx';
import { MainHeader } from '@html/MainHeader.tsx';
import path from 'node:path';
import { Style } from '@html/components/style.tsx';
import { jsx } from 'jsx';
import { Room } from '../../../data/room.ts';
import { ArticlesHelper } from '../../../articles/articles-helper.ts';


interface MakeRoomProps {
	currentRoom?: Room | null;
}


const limitUsers = false;


export function MakeRoom(props: MakeRoomProps)
{
	const styleSrc = path.join(import.meta.dirname!, 'style.css');

	return (
		<Root title='MoþFAL - Make Room'>
			<MainHeader>Make Room</MainHeader>

			<main>
				<DomainsSection />
				<RulesSection />
			
				{props.currentRoom ? (
					<div class='std-box-pop g-foreground'>
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
					hx-push-url='true'>
					Make
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


function DomainsSection()
{
	// fight me bro
	const onclick = `
		document.querySelectorAll('[data-domain]').forEach(x => x.hidden = true);
		document.querySelectorAll('[data-domain="%domain%"]').forEach(x => x.hidden = false);
	`;

	return (
		<section class='domains std-box-pop g-foreground'>
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
		<section class='rules std-box-pop g-foreground'>

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