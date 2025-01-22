import { JsxElementChild } from './jsx';
import escapeHtml from '../helpers/escape-html';


export class JsxRenderer
{
	public static FragmentType: symbol = Symbol('Fragment');

	private static voidElements: Set<string> = new Set([
		'area',
		'base',
		'br',
		'col',
		'embed',
		'hr',
		'img',
		'input',
		'link',
		'meta',
		'source',
		'track',
		'wbr'
	]);


	private indentChar: string;
	private joinChar: string;


	public constructor(indented: boolean)
	{
		if (indented)
		{
			this.indentChar = '\t';
			this.joinChar = '\n';
		}
		else
		{
			this.indentChar = '';
			this.joinChar = '';
		}
	}


	public render(element: JsxElementChild): string
	{
		return this.renderUnknown(element, '');
	}


	public renderUnknown(renderable: JsxElementChild, indent: string): string
	{
		switch (typeof renderable)
		{
			case 'string':
				return indent + escapeHtml(renderable);

			case 'object':
				return Array.isArray(renderable)
					? this.renderChildren(renderable, indent)
					: this.renderElement(renderable, indent);

			// Handle the fact that JsxElementChild is more like any
			default:
				return renderable !== undefined ? indent + String(renderable) : '';
		}
	}

	private renderElement(element: JSX.Element, indent: string): string
	{
		const { type, children } = element;

		if (typeof type === 'symbol')
			return this.renderChildren(children, indent); // Fragment is the only symbol

		let attributes: string = '';
		let innerHtml: string | null = null;

		for (const [key, value] of Object.entries(element.attributes))
		{
			if (value === undefined)
				continue;
			
			switch (key)
			{
				// case 'DANGEROUSLY_SET_OUTER_HTML':
				// 	return String(value);
				
				case 'DANGEROUSLY_SET_INNER_HTML':
					innerHtml = String(value);
					break;

				default:
					attributes += ` ${key}="${escapeHtml(String(value))}"`;
					break;
			}
		}

		const content: string = innerHtml ?? this.renderChildren(children, indent + this.indentChar);

		if (content.length === 0)
		{
			if (JsxRenderer.voidElements.has(type))
				return `${indent}<${type}${attributes}/>`;

			return `${indent}<${type}${attributes}></${type}>`;
		}

		return `${indent}<${type}${attributes}>${content}${indent}</${type}>`;
	}

	private renderChildren(children: JsxElementChild[], indent: string): string
	{
		let html: string = '';

		for (const child of children)
			html += this.joinChar + this.renderUnknown(child, indent);

		if (html.length)
			html += this.joinChar;

		return html;
	}
}
