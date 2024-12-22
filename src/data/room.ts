import { Rules } from '../articles/articles-helper.ts';
import { Article } from './article.ts';
import { User } from './user.ts';

export interface Room {
	id: string;
	users: Record<User['id'], User>;
	domainName: string;
	articles: Article[];
	currentArticle: number;
	guesserId: User['id'];
	rules: Rules;
	usersLimit: number;
	creationTime: number;
	kicked: User['id'][];
}