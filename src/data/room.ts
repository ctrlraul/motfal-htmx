import { Rules } from '../articles/articles-helper';
import { Article } from './article';
import { User } from './user';

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