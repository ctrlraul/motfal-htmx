import { Article } from '../data/article';
import { jsx, Fragment } from '@jsx';

interface ArticleTitleProps {
	preserveStyle: boolean;
	article: Article;
}

export function ArticleTitle(props: ArticleTitleProps)
{
	if (!props.preserveStyle || !props.article.italic)
		return <>{props.article.title}</>;

	return <i>{props.article.title}</i>;
}