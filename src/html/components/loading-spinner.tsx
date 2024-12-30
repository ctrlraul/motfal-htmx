import { jsx, JsxElement } from 'jsx';

interface LoadingSpinnerProps {
	[key: string]: unknown;
}

export function LoadingSpinner(props: LoadingSpinnerProps)
{
	const element: JsxElement = (
		<div {...props}>
			<div class='spinner'></div>
		</div>
	);

	if (!element.attributes.class)
		element.attributes.class = '';
	
	element.attributes.class += ' g-loading-spinner g-indicator';

	return element;
}