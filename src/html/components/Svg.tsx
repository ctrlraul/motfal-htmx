import { importText } from '../../helpers/import-text.ts';
import { omit } from '../../helpers/omit.ts';
import { FromHtml } from '@html/components/FromHtml.tsx';
import { jsx } from 'jsx';


interface SvgProps {
	src: string;
	[K: string]: unknown;
}


/** Inline SVG */
export function Svg(props: SvgProps)
{
	const svg = importText(props.src);
	const attributes = omit(props, ['src']);
	return <FromHtml {...attributes} html={svg} />
}


// function shitToUsefulShit(json: JSONContent): JsxElement
// {
// 	const element: JsxElement = {
// 		tag: json.type,
// 		attributes: json.content,
// 	};

// 	return element;
// }