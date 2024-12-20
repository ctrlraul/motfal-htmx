import { Root } from '../../Root.tsx';
import { MainHeader } from '../../MainHeader.tsx';
import { Style } from '@html/components/style.tsx';
import path from 'node:path';
import { jsx } from 'jsx';

const styleSrc = path.join(import.meta.dirname!, 'style.css');

export function Rules()
{
	return (
		<Root title='MoþFAL - How to play'>
			<MainHeader>
				How to play
			</MainHeader>

			<main>
				<div>One player is the guesser, the rest are liars.</div>
				<div>Each liar selects an article.</div>
				<div>One article is picked at random, and only its title is shown.</div>
				<div>The liars come up with their own description of what the article is about.</div>
				<div>The guesser tries to figure out which liar chose the article.</div>
			</main>

			<footer hx-get='/'
				hx-target='#root'
				hx-swap='outerHTML'
				hx-push-url='true'>
				Ok
			</footer>

			<Style src={styleSrc} />
		</Root>
	);
}