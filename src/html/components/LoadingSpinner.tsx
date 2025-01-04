import { jsx } from '@jsx';

interface LoadingSpinnerProps {
	[key: string]: unknown;
}

export function LoadingSpinner(props: LoadingSpinnerProps)
{
	const element = (
		<div {...props}>
			<div class='spinner'></div>
		</div>
	);

	if (!element.attributes.class)
		element.attributes.class = '';
	
	element.attributes.class += ' g-loading-spinner g-indicator';

	return element;
}