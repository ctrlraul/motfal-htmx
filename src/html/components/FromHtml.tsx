import { jsx, Fragment, htmlToJsx, JsxElementChild } from '@jsx';
import { omit } from '../../helpers/omit';



interface FromHtmlProps {
	html: string;
	children?: JsxElementChild[];
	[K: string]: unknown;
}

/** Create JSX elements from raw HTML */
export function FromHtml(props: FromHtmlProps): JSX.Element
{
	const children = htmlToJsx(props.html);

	for (const child of children)
	{
		if (typeof child !== 'object')
			continue;
		
		if (Array.isArray(child))
			continue;

		if (props.children)
			child.children.push(...props.children);

		Object.assign(child.attributes, omit(props, ['html']));

		break;
	}

	return <>{children}</>;
}