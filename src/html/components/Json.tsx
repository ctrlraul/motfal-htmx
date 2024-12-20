import { jsx } from 'jsx';

const indent = true;

/** Inline JSON for use like `JSON.parse(document.getElementById(...).textContent)` */
export function Json(props: { id: string, data: unknown }) {

	const json = indent
		? JSON.stringify(props.data, null, '\t')
		: JSON.stringify(props.data);

	return (
		<script id={props.id}
			type='application/json'
			DANGEROUSLY_SET_INNER_HTML={json}>
		</script>
	)
}