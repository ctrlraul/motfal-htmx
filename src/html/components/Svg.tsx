import { importText } from '../../helpers/import-text';
import { omit } from '../../helpers/omit';
import { FromHtml } from '@html/components/FromHtml';
import { jsx } from '@jsx';


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
