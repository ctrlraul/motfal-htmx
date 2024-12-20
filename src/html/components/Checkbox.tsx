import { jsx } from 'jsx';

interface CheckboxProps {
	checked: boolean;
	[K: string]: unknown;
}

export function Checkbox(props: CheckboxProps)
{
	const attributes: Partial<CheckboxProps> = Object.assign({}, props);
	delete attributes['checked'];

	if (props.checked)
		return <input type='checkbox' {...attributes} checked />;

	return <input type='checkbox' {...attributes} />;
}