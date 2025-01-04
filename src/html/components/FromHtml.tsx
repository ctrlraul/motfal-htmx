import { jsx, Fragment, fromHtml } from '@jsx';
import { omit } from '../../helpers/omit';



interface FromHtmlProps {
	html: string;
	children?: JSX.Element['children'];
	[K: string]: unknown;
}

/** Create JSX elements from raw HTML */
export function FromHtml(props: FromHtmlProps)
{
	const elements = fromHtml(props.html);
	const first = elements[0];

	if (elements.length === 0 || typeof first === 'string')
		return <>{elements}</>;

	if (props.children)
		first.children.push(...props.children);

	Object.assign(first.attributes, omit(props, ['html']));

	return <>{elements}</>;
}