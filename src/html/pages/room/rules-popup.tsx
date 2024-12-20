import path from 'node:path';
import { Room } from '../../../data/room.ts';
import { Style } from '@html/components/style.tsx';
import { Checkbox } from '@html/components/Checkbox.tsx';
import { jsx } from 'jsx';

const styleSrc = path.join(import.meta.dirname!, 'style.css');

export function RulesPopup(props: { room: Room })
{
	return (
		<div id='rulesPopup' hx-on:click='this.hidden = true' hidden>
			<div class='std-box-pop g-foreground'>
				<span>Rules</span>
				<label>
					<Checkbox disabled checked={props.room.ruleAnyNamespace} />
					Allow articles in any namespace
				</label>
				<label>
					<Checkbox disabled checked={props.room.rulePreserveTitleStyle} />
					Preserve article title style
				</label>
			</div>

			<Style src={styleSrc} />
		</div>
	);
}