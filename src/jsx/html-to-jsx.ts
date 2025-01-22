import { JsxElementChild } from '@jsx';
import { parseDocument, ElementType } from 'htmlparser2';
import { ChildNode, Element } from 'domhandler';


export function htmlToJsx(html: string): JsxElementChild[]
{
	const dom = parseDocument(html);
	return parseChildNodes(dom.children);
}


function parseChildNodes(nodes: ChildNode[]): JsxElementChild[]
{
	const result: JsxElementChild[] = [];

	for (const node of nodes)
	{
		switch (node.type)
		{
			case ElementType.Text:
				result.push(node.data);
				break;
			
			case ElementType.Tag:
			case ElementType.Script:
			case ElementType.Style:
				result.push(parseElement(node));
				break;
			
			case ElementType.Root:
			case ElementType.Directive:
			case ElementType.CDATA:
				break;
		}
	}

	return result;
}

function parseElement(element: Element): JSX.Element
{
	return {
		type: element.name,
		attributes: element.attribs,
		children: parseChildNodes(element.children)
	};
}