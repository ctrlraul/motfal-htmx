import { Article } from '../../data/article.ts';
import { ItemSuggestion, Domain, Rules } from '../articles-helper.ts';
import Axios from 'axiod';


interface ArticlesResponse {
	batchcomplete: string;
	continue: {
		grncontinue: string;
		continue: string;
	},
	query: {
		pages: Record<string, {
			pageid: number;
			ns: number;
			title: string;
		}>
	}
}


const apiBaseUrl = 'https://wikipedia.org/';
const axios = Axios.create({ baseURL: apiBaseUrl });


async function getArticle(id: string): Promise<Article>
{
	const title = getTitleFromId(id);

	console.log(id, '->', title);

	const response = await axios.get('/w/api.php', {
		params: {
			action: 'query',
			titles: title,
			format: 'json',
			redirects: '1',
			prop: 'pageprops|pageimages|description|extracts',
			exintro: '1',
			explaintext: '1',
			pithumbsize: '500',
			origin: '*'
		}
	});

	// deno-lint-ignore no-explicit-any
	const pageData: any = Object.values(response.data.query.pages)[0];

	const article: Article = {
		link: new URL('wiki/' + title, apiBaseUrl).href,
		title: response.data.query.redirects ? response.data.query.redirects[0].from : pageData.title,
		description: pageData.extract,
		thumbnail: pageData.thumbnail ? pageData.thumbnail.source : null,
		italic: (pageData.pageprops.displaytitle || '').startsWith('<i>'),
	};

	return article;
}

async function getRandomArticles(count: number, _rules: Rules): Promise<ItemSuggestion[]>
{
	const namespaces: number[] = [
		0 // Articles namespace
	];

	const response = await axios.get<ArticlesResponse>('/w/api.php', {
		params: {
			action: 'query',
			generator: 'random',
			grnnamespace: namespaces.join('|'),
			grnlimit: count.toString(),
			format: 'json',
			origin: '*' // Handle CORS
		}
	});

	const suggestions: ItemSuggestion[] = Object.values(response.data.query.pages).map(item => ({
		id: item.title,
		search: new URL('wiki/' + item.title, apiBaseUrl).href,
		title: item.title,
	}));

	return suggestions;
}


function getTitleFromId(id: string): string
{
	// Not a link, assume it's the title itself
	if (id.indexOf('/') === -1)
		return id;
	
	const protocolTest = /^(http|https):\/\//;
	const url = new URL(protocolTest.test(id) ? id : 'https://' + id);

	if (url.searchParams.has('title'))
		return url.searchParams.get('title')!;

	const pathSegments = url.pathname.split('/');
	const encodedTitle = pathSegments[pathSegments.length - 1];

	return decodeURIComponent(encodedTitle);
}


export const WikipediaOrg: Domain = {
	name: 'Wikipedia',
	itemName: 'Article',
	submitInputPlaceholder: 'Article name or Wikipedia link',
	ruleSet: [{
		id: 'anyNamespace',
		name: 'Any Namespace',
		description: 'Allow picking articles in any namespace',
		defaultValue: true,
	}, {
		id: 'preserveTitleStyle',
		name: 'Preserve Title Style',
		description: 'Preserve the title style of articles (italics)',
		defaultValue: true,
	}],
	getArticle,
	getRandomArticles,
}