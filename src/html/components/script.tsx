import { importText } from '../../helpers/import-text.ts';
import { jsx } from 'jsx';

/** Inline JS */
export function Script(props: { src: string }) {
	return <script DANGEROUSLY_SET_INNER_HTML={importText(props.src)}></script>
}