import { jsx } from 'jsx';


interface ArticlesCounterProps {
	count: number;
	swappingExistent?: boolean;
}


const id = 'articles-counter';


export function ArticlesCounter(props: ArticlesCounterProps)
{
	if (props.swappingExistent == undefined)
		props.swappingExistent = true;

	const text = `${props.count} Article${props.count === 1 ? '' : 's'} submitted`;

	if (props.swappingExistent)
	{
		return (
			<span id={id} hx-swap-oob={'outerHTML:#' + id} style='font-size: 1.2rem;'>
				{text}
			</span>
		);
	}

	return (
		<span id={id} style='font-size: 1.2rem;'>
			{text}
		</span>
	);
}