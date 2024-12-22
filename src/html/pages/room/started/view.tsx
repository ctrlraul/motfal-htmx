import { Article } from '../../../../data/article.ts';
import { Room } from '../../../../data/room.ts';
import { ArticleTitle } from '@html/ArticleTitle.tsx';
import { jsx, Fragment } from 'jsx';

interface RoomStartedProps {
	article: Article;
	room: Room;
}

export function RoomStarted(props: RoomStartedProps)
{
	const style = /*style*/`
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: 1rem;
		text-align: center;
		color: var(--color-accent);
		flex: 1;
	`;

	return (
		<>
			<section style='flex: 1; display: flex; flex-direction: column;'>
				<h3 style={style}>
					<ArticleTitle
						article={props.article}
						preserveStyle={props.room.rules.preserveTitleStyle}
					/>
				</h3>
			</section>
			
			<div class='std-box'>
				<button class='g-big create'
					hx-get='/make'
					hx-target='#root'
					hx-swap='outerHTML'
					hx-push-url='true'
					style='width: 100%;'>
					Make new room
				</button>
			</div>
		</>
	);
}