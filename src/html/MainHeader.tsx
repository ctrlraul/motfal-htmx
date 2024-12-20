import { jsx } from 'jsx';

export interface BasicHeaderProps {
	children?: unknown;
}

export function MainHeader(props: BasicHeaderProps): string
{
	const style = /*style*/`
		font-size: font-size: calc(2rem * sqrt(2));
		font-weight: 600;
		text-align: center;
		padding: 0.5rem;
	`;

	return (
		<header class='std-box g-foreground' style={style}>
			<i>
				{props.children || 'Most Of These Folks Are Lying'}
			</i>
		</header>
	);
}