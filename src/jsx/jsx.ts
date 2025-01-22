declare global {
	namespace JSX {
		
		interface Element {
			type: string | symbol;
			attributes: IntrinsicAttributes;
			children: JsxElementChild[];
		}

		interface IntrinsicElements {
			[tagName: string]: any; // Allow any tag
		}

		interface IntrinsicAttributes {
			[attr: string]: any; // Allow any attribute
		}
	}
}


import { JsxRenderer } from './jsx-renderer';
import { htmlToJsx } from './html-to-jsx';


// More like any since TS assumes this is react, in which case you can pass pretty much anything as child
export type JsxElementChild = JSX.Element | string | JsxElementChild[];


// export function jsx(type: unknown, attributes: JSX.IntrinsicAttributes | null, ...children: JSX.Element[]): JSX.Element | JSX.Element[]
// {
// 	if (typeof type === 'function')
// 	{
// 		if (type === Fragment)
// 			return children;

// 		return type({ ...attributes, children });
// 	}

// 	return {
// 		type: type as string,
// 		attributes: attributes || {},
// 		children
// 	};
// }

// export function Fragment(_type: unknown, _attributes: JSX.IntrinsicAttributes | null, ...children: JSX.Element[]): Renderable[]
// {
// 	return children;
// }


type JsxElementFunction = (props: JSX.IntrinsicAttributes) => JSX.Element;


function jsx(
	type: string | JsxElementFunction,
	attributes: JSX.IntrinsicAttributes | null,
	...children: JsxElementChild[]): JSX.Element
{
	if (typeof type === 'string')
	{
		return {
			type: type,
			attributes: attributes || {},
			children
		};
	}

	return type({ ...attributes, children });
}

function Fragment(props: JSX.IntrinsicAttributes): JSX.Element
{
	return {
		type: JsxRenderer.FragmentType,
		attributes: {},
		children: props.children
	};
}

function render(element: JsxElementChild, indented: boolean = true): string
{
	const renderer = new JsxRenderer(indented);
	const html = renderer.render(element);
	return html.trim();
}


export {
	jsx,
	Fragment,
	render,

	htmlToJsx,
};