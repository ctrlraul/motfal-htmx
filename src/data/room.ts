import { Article } from './article.ts';
import { User } from './user.ts';

export interface Room {
	id: string;
	users: Record<User['id'], User>;
	articles: Article[];
	currentArticle: number;
	guesserId: User['id'];
	ruleAnyNamespace: boolean;
	rulePreserveTitleStyle: boolean;
	usersLimit: number;
	creationTime: number;
	kicked: User['id'][];
}