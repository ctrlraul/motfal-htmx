import { Article } from '../../data/article.ts';


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


const apiBaseUrl = 'https://wikipedia.org/w/api.php';


async function getArticleData(link: string): Promise<Article>
{
	const url = new URL(link);
	const title = extractTitleFromUrl(url);

	const params = new URLSearchParams({
		action: 'query',
		titles: title,
		format: 'json',
		redirects: '1',
		prop: 'pageprops|pageimages|description|extracts',
		exintro: '1',
		explaintext: '1',
		pithumbsize: '500',
		origin: '*'
	});

	const endpoint = apiBaseUrl + '?' + params.toString();
	const response = await fetch(endpoint);
	
	if (!response.ok)
		throw new Error(`Error fetching data: ${response.statusText}`);

	const rawData = await response.json();
	// deno-lint-ignore no-explicit-any
	const pageData: any = Object.values(rawData.query.pages)[0];
	const articleData: Article = {
		link: link,
		title: rawData.query.redirects ? rawData.query.redirects[0].from : pageData.title,
		description: pageData.extract,
		thumbnail: pageData.thumbnail ? pageData.thumbnail.source : null,
		italic: (pageData.pageprops.displaytitle || '').startsWith('<i>'),
	};

	return articleData;
}

async function getRandomArticles(amount: number, namespaces: number[])
{
    const baseURL = 'https://en.wikipedia.org/w/api.php';
    const url = new URL(baseURL);
    const params = new URLSearchParams({
        action: 'query',
        generator: 'random',
        grnnamespace: namespaces.join('|'),
        grnlimit: amount.toString(),
        format: 'json',
        origin: '*' // Handle CORS
    });

    url.search = params.toString();

    const response = await fetch(url.href);
    const data: ArticlesResponse = await response.json();
    const articles = Object.values(data.query.pages);

    return articles;
}

function extractTitleFromUrl(url: URL): string
{
	if (url.searchParams.has('title'))
		return url.searchParams.get('title')!;

	return decodeURIComponent(url.pathname.split('/').pop()!);
}


export const WikipediaOrg = {
	getArticleData,
	getRandomArticles,
}