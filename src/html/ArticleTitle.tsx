import { jsx } from 'jsx';
import { Article } from '../data/article.ts';

interface ArticleTitleProps {
	preserveStyle: boolean;
	article: Article;
}

export function ArticleTitle(props: ArticleTitleProps)
{
	if (!props.preserveStyle || !props.article.italic)
		return props.article.title;

	return <i>{props.article.title}</i>;
}