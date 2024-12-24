import { jsx } from 'jsx';
import { Article } from '../../../../data/article.ts';
import { Room } from '../../../../data/room.ts';
import { ArticleTitle } from '@html/ArticleTitle.tsx';
import * as Icons from '@html/icons.tsx';

interface ArticleSubmittedProps {
	room: Room;
	article: Article;
}

export function ArticleSubmitted(props: ArticleSubmittedProps)
{
	const style = /*style*/`
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		text-align: center;
	`;
	
	return (
		<div style={style}>
			<div class="g-box">
				<div>You submitted</div>
				<span>
					<a href={props.article.link} target='_blank' style='color: inherit'>
						<button style='display: flex; margin: auto; align-items: center; padding: 0.5rem'>

							<ArticleTitle article={props.article}
								preserveStyle={props.room.rules.preserveTitleStyle as boolean}/>
							
							<Icons.OpenExternal style='width: 1.5rem; height: 1.5rem; margin-left: 0.25rem;'/>
							
						</button>
					</a>
				</span>
			</div>
			<br />
			<div>Waiting room start...</div>
		</div>
	);
}