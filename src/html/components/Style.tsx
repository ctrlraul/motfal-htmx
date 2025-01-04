import { jsx } from '@jsx';

/** Inline CSS */
export function Style(props: { css: string }) {
	return <style DANGEROUSLY_SET_INNER_HTML={props.css}></style>;
}