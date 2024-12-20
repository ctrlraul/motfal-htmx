import { Article } from '../data/article.ts';
import { WikipediaOrg } from './domains/wikipedia.org.ts';


type GetArticleDataFn = (link: string) => Promise<Article>;

const domains: Map<string, GetArticleDataFn> = new Map();



// Register domains here
domains.set('wikipedia.org', WikipediaOrg.getArticleData);



async function get(link: string): Promise<Article>
{
	// Ensure link includes the protocol
	if (!linkHasProtocol(link))
		link = 'http://' + link;

	const url = new URL(link);
	const linkDomain = url.hostname;

	for (const domain of domains.keys())
	{
		if (!linkDomain.endsWith(domain))
			continue;

		const getArticleData = domains.get(domain)!;
		const data = await getArticleData(link);

		return data;
	}

	throw new Error('Domain not whitelisted');
}

function linkHasProtocol(link: string): boolean {
	return /^\w+:\/\//i.test(link);
}


export const ArticlesHelper = {
	get,
}