import { importText } from '../../helpers/import-text.ts';
import { jsx } from 'jsx';

/** Inline CSS */
export function Style(props: { src: string }) {
	return <style DANGEROUSLY_SET_INNER_HTML={importText(props.src)}></style>;
}