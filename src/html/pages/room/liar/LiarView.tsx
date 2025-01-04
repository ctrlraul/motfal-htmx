import { jsx, Fragment } from '@jsx';
import { Room } from '../../../../data/room';
import { LoadingSpinner } from '@html/components/LoadingSpinner';
import { ArticleSubmitted } from '@html/pages/room/liar/ArticleSubmitted';
import { Style } from '@html/components/Style';
import { ArticlesHelper } from '../../../../articles/articles-helper';
import { User } from '../../../../data/user';
import css from './liar.css';


interface LiarViewProps {
	room: Room;
	user: User;
}


export function LiarView(props: LiarViewProps)
{
	const article = props.room.articles.find(article => article.userId == props.user.id);
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
			
			<Style css={css} />
		</>
	);
}