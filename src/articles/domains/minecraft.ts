import mcData from 'minecraft-data';
import { Domain, ItemSuggestion, Rules } from '../articles-helper';
import { Article } from '../../data/article';


const version = '1.19.4';
const minecraftData = mcData(version);


async function getArticle(name: string): Promise<Article>
{
	const item = minecraftData.itemsByName[name];

	if (!item)
		throw new Error('Item not found');

	const article: Article = {
		description: '',
		italic: false,
		link: `https://minecraftitemids.com/item/${item.name.replaceAll('_', '-')}`,
		thumbnail: `https://minecraftitemids.com/item/${item.name}.png`,
		title: item.displayName,
	};

	return article;
}

async function getRandomArticles(count: number, rules: Rules): Promise<ItemSuggestion[]>
{
	const itemNames = Object.keys(minecraftData.itemsByName);
	const items: ItemSuggestion[] = Array.from({ length: count }, () =>
	{
		const name = itemNames[Math.floor(Math.random() * itemNames.length)];
		const item = minecraftData.itemsByName[name];
		const suggestion: ItemSuggestion = {
			id: item.name,
			title: item.displayName,
			search: `https://minecraftitemids.com/item/${item.name.replaceAll('_', '-')}`
		};

		return suggestion;
	});

	return items;
}


export const Minecraft: Domain = {
	name: 'Minecraft',
	itemName: 'item',
	submitInputPlaceholder: 'Item name',
	ruleSet: [],
	getArticle,
	getRandomArticles,
}
