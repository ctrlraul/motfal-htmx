import { jsx } from 'jsx';
import { OpenExternal } from '@html/icons.tsx';


export function SuggestionsListItem(props: { title: string }) {

	const link = 'https://en.wikipedia.org/wiki/' + props.title;

	return (
		<li onclick={`suggestionLink.value = '${link}'`}>
			<span style='flex: 1;'>{props.title}</span>
			<a href={link} target='_blank' style='align-self: flex-start;'>
				<button style='width: 2em; height: 2em; padding: 0.1em;'>
					<OpenExternal />
				</button>
			</a>
		</li>
	);
}