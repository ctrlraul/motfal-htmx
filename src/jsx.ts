import escapeHtml from './helpers/escape-html.ts';
import { parseDocument, ElementType } from 'htmlparser2';


export interface JsxElement {
	tag: string;
	attributes: Record<string, unknown>;
	children: (JsxElement | string)[];
}


const voidElements: Set<string> = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const indentChar = '\t';


function jsx(tag: unknown, attributes: Record<string, unknown> | null, ...children: JsxElement[]): JsxElement | JsxElement[]
{
	if (typeof tag === 'function')
	{
		if (tag === Fragment)
			return children;

		return tag({ ...attributes, children });
	}

	return {
		tag: tag as string,
		attributes: attributes || {},
		children
	};
}

function Fragment(...children: JsxElement['children']): JsxElement['children']
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
		return renderElement(element as JsxElement, indent);

	return String(element);
}

function fromHtml(html: string): JsxElement['children']
{
	const dom = parseDocument(html);
	const result: JsxElement['children'] = dom.children
		.map(child => toJsxElement(child))
		.filter(element => element != null);
	
	return result;
}

type HtmlParser2Node = ReturnType<typeof parseDocument>['children'][number];

function toJsxElement(node: HtmlParser2Node): JsxElement | string | null
{
	switch (node.type)
	{
		case ElementType.Text:
			return node.data;
		
		case ElementType.Tag:
		case ElementType.Script:
		case ElementType.Style:
			return {
				tag: node.name,
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

function renderElement(element: JsxElement, indent: string): string
{
	const { tag } = element as JsxElement;

	let attributes: string = '';
	let innerHtml: string | null = null;

	for (const key in element.attributes)
	{
		const value = String(element.attributes[key]);

		switch (key)
		{
			case 'DANGEROUSLY_SET_OUTER_HTML':
				return value;
			
			case 'DANGEROUSLY_SET_INNER_HTML':
				innerHtml = value;
				break;

			default:
				attributes += ` ${key}="${escapeHtml(value)}"`;
				break;
		}
	}

	const nextIndent: string = indent + indentChar;
	const content: string = innerHtml ? innerHtml : element.children.map(item => render(item, nextIndent)).join('\n');

	if (voidElements.has(tag) && content.length === 0)
		return `${indent}<${tag}${attributes} />`;
	
	if (content.length === 0)
		return `${indent}<${tag}${attributes}></${tag}>`;

	return `${indent}<${tag}${attributes}>${content}${indent}</${tag}>`;
}


export {
	jsx,
	Fragment,
	render,
	fromHtml,
}