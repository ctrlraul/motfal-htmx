import { jsx, Fragment } from 'jsx';
import { Room } from '../../../../data/room.ts';
import { LoadingSpinner } from '@html/components/loading-spinner.tsx';
import { ArticleSubmitted } from '@html/pages/room/liar/ArticleSubmitted.tsx';
import { Style } from '@html/components/style.tsx';
import path from 'node:path';
import { ArticlesHelper } from '../../../../articles/articles-helper.ts';


interface LiarViewProps {
	room: Room;
	userId: string;
}


export function LiarView(props: LiarViewProps)
{
	const article = props.room.articles.find(article => article.userId == props.userId);
	const domain = ArticlesHelper.getDomain(props.room.domainName)!;

	if (article)
		return <ArticleSubmitted room={props.room} article={article} />

	return (
		<>
			<section class='submit g-box'>
				
				<div>Submit {domain.itemName}</div>

				<form hx-post='/submit'
					hx-target='#room-view'
					hx-swap='innerHTML'
					hx-trigger='submit'
					hx-indicator='#submit-indicator'>
					
					<input class='g-big'
						type='text'
						id='suggestionLink'
						name='link'
						placeholder={domain.submitInputPlaceholder}
						required />

					<button class='g-big'>Submit</button>
				</form>
			</section>
			
			<section class='suggestions g-box g-foreground'>
				<div style='display: flex'>
					<span style='flex: 1'>Suggestions</span>
					<button hx-get='/suggestions'
						hx-target='#suggestions'
						hx-swap='innerHTML'
						hx-trigger='mousedown, load'
						hx-indicator='#suggestions-indicator'>
						Reroll
					</button>
				</div>
				
				<div style='position: relative'>
					<ul id='suggestions'></ul>
					<LoadingSpinner id='suggestions-indicator' />
				</div>
			</section>

			<LoadingSpinner id='submit-indicator' />
			
			<Style src={path.join(import.meta.dirname!, 'liar.css')} />
		</>
	);
}