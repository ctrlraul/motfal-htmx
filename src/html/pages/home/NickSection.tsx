import { jsx } from 'jsx';
import { Pencil } from '@html/icons.tsx';

export function NickSection(props: { nick: string })
{
	return (
		<div id='nick' hx-get='/nick-change' hx-swap='outerHTML'>
			Playing as
			<span>
				{props.nick}
			</span>
			<Pencil />
		</div>
	);
}