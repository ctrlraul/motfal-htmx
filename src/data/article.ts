import { User } from './user';

export interface Article {
	title: string;
	description: string;
	link: string;
	thumbnail: string;
	italic: boolean;
	userId?: User['id'];
}