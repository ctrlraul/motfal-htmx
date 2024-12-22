import { jsx } from 'jsx';

export interface BasicHeaderProps {
	children?: unknown;
}

export function MainHeader(props: BasicHeaderProps)
{
	const css = /*css*/`
		header.main {
			font-size: calc(1rem * sqrt(2));
			font-weight: 600;
			text-align: center;
			padding: 0.5rem;
		}

		@media (min-width: 30rem) {
			header.main {
				border-bottom-left-radius: var(--radius-common);
				border-bottom-right-radius: var(--radius-common);
			}
		}
	`;

	return (
		<header class='main std-box g-foreground'>
			<i>
				{props.children || 'Most Of These Folks Are Lying'}
			</i>

			<style>{css}</style>
		</header>
	);
}