import escapeHtml from './helpers/escape-html';
import { parseDocument, ElementType } from 'htmlparser2';


declare global {
	namespace JSX {
		
		interface Element {
			type: any;
			attributes: Record<string, unknown>;
			children: (Element | string)[];
		}

		interface IntrinsicElements {
			[tagName: string]: any; // Allow any tag name with any props
		}

		interface IntrinsicAttributes {
			[attr: string]: any; // Allow any attribute
		}
	}
}


const voidElements: Set<string> = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);


function jsx(type: unknown, attributes: Record<string, unknown> | null, ...children: JSX.Element[]): JSX.Element | JSX.Element[]
{
	if (typeof type === 'function')
	{
		if (type === Fragment)
			return children;

		return type({ ...attributes, children });
	}

	return {
		type: type as string,
		attributes: attributes || {},
		children
	};
}

function Fragment(_type: unknown, _attributes: Record<string, unknown> | null, ...children: JSX.Element[]): JSX.Element['children']
{
	return children;
}

function render(element: unknown, indent: string = ''): string
{
	// Handle text
	if (typeof element === 'string')
		return indent + escapeHtml(element);

	// Handle Fragment
	if (Array.isArray(element))
		return element.map(item => render(item, indent)).join('\n');
	
	// Handle Element
	if (typeof element === 'object' && element !== null)
		return renderElement(element as JSX.Element);

	return String(element);
}

function fromHtml(html: string): JSX.Element['children']
{
	const dom = parseDocument(html);
	const result: JSX.Element['children'] = dom.children
		.map(child => toJsxElement(child))
		.filter(element => element != null);
	
	return result;
}

function toJsxElement(node: ReturnType<typeof parseDocument>['children'][number]): JSX.Element | string | null
{
	switch (node.type)
	{
		case ElementType.Text:
			return node.data;
		
		case ElementType.Tag:
		case ElementType.Script:
		case ElementType.Style:
			return {
				type: node.name,
				attributes: node.attribs,
				children: node.children.map(toJsxElement).filter(child => child != null)
			};
		
		case ElementType.Root:
		case ElementType.Directive:
		case ElementType.CDATA:
			break;
	}

	return null;
}

function renderElement(element: JSX.Element): string
{
	const { type: tag } = element;

	let attributes: string = '';
	let innerHtml: string | null = null;

	for (const [key, value] of Object.entries(element.attributes))
	{
		if (value === undefined)
			continue;
		
		switch (key)
		{
			case 'DANGEROUSLY_SET_OUTER_HTML':
				return String(value);
			
			case 'DANGEROUSLY_SET_INNER_HTML':
				innerHtml = String(value);
				break;

			default:
				attributes += ` ${key}="${escapeHtml(String(value))}"`;
				break;
		}
	}

	const content: string = innerHtml ? innerHtml : element.children.map(item => render(item)).join('');

	if (voidElements.has(tag) && content.length === 0)
		return `<${tag}${attributes} />`;
	
	// if (content.length === 0)
	// 	return `<${tag}${attributes}></${tag}>`;

	return `<${tag}${attributes}>${content}</${tag}>`;
}


export {
	jsx,
	Fragment,
	render,
	fromHtml,
}