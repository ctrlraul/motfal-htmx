import { jsx } from 'jsx';
import { OpenExternal } from '@html/icons.tsx';
import { ItemSuggestion } from '../../../../articles/articles-helper.ts';

export function SuggestionsListItem(props: ItemSuggestion)
{
	return (
		<li onclick={`suggestionLink.value = '${props.id}'`}>
			<span style='flex: 1;'>{props.title}</span>
			<a href={props.search} target='_blank' style='color: inherit; align-self: flex-start;'>
				<button style='width: 2em; height: 2em; padding: 0.1em;'>
					<OpenExternal />
				</button>
			</a>
		</li>
	);
}