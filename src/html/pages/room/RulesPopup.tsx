import path from 'node:path';
import { Room } from '../../../data/room.ts';
import { Style } from '@html/components/style.tsx';
import { jsx } from 'jsx';
import { ArticlesHelper } from '../../../articles/articles-helper.ts';

const styleSrc = path.join(import.meta.dirname!, 'style.css');

export function RulesPopup(props: { room: Room })
{
	const rules = Object.entries(props.room.rules);

	return (
		<div id='rulesPopup' hx-on:click='this.hidden = true' hidden>
			<div class='std-box-pop g-foreground'>
				
				<span>Rules</span>

				{rules.map(([id, value]) =>
					<InputForRule domainName={props.room.domainName} id={id} value={value} />
				)}

			</div>

			<Style src={styleSrc} />
		</div>
	);
}

function InputForRule(props: { domainName: string, id: string, value: boolean })
{
	const rule = ArticlesHelper.getRule(props.domainName, props.id);

	return (
		<label>
			<input type='checkbox' disabled checked={props.value || undefined} />
			{rule.name}
		</label>
	)
}