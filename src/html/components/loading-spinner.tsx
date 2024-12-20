import { jsx } from 'jsx';

export function LoadingSpinner(props: { id?: string }) {
	return (
		<div id={props.id || ''} class='g-loading-spinner g-indicator'>
			<div class='spinner'></div>
		</div>
	)
}