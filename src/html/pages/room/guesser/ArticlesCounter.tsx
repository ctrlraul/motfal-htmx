import { jsx } from '@jsx';
import { ArticlesHelper } from '../../../../articles/articles-helper';
import { Room } from '../../../../data/room';
import { capitalCase } from 'change-case';


interface ArticlesCounterProps {
	room: Room;
	swappingExistent?: boolean;
}


const id = 'items-counter';


export function ArticlesCounter(props: ArticlesCounterProps)
{
	if (props.swappingExistent == undefined)
		props.swappingExistent = true;

	const count = props.room.articles.length;
	const domain = ArticlesHelper.getDomain(props.room.domainName)!;

	const element: JSX.Element = (
		<span id={id} style='font-size: 1.2rem;'>
			{count} {capitalCase(domain.itemName + (count === 1 ? '' : 's'))} submitted
		</span>
	);

	if (props.swappingExistent)
		element.attributes['hx-swap-oob'] = 'outerHTML:#' + id;

	return element;
}