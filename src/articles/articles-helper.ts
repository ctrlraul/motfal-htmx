import { Article } from '../data/article.ts';
import { PokeApi } from './domains/pokeapi.co.ts';
import { WikipediaOrg } from './domains/wikipedia.org.ts';
import { WiktionaryOrg } from './domains/wiktionary.org.ts';


export interface Rule {
	id: string;
	name: string;
	description: string;
	defaultValue: boolean;
}

export interface Rules {
	[id: Rule['id']]: boolean;
};

export interface ItemSuggestion {
	id: string;
	title: string;
	search: string;
}

export interface Domain {
	name: string;
	itemName: string;
	submitInputPlaceholder: string;
	ruleSet: Rule[];
	getArticle(link: string): Promise<Article>;
	getRandomArticles(count: number, rules: Rules): Promise<ItemSuggestion[]>;
}


const domains: Map<string, Domain> = new Map();



// Register domains here
domains.set(WikipediaOrg.name, WikipediaOrg);
domains.set(WiktionaryOrg.name, WiktionaryOrg);
domains.set(PokeApi.name, PokeApi);



function getArticle(domainName: string, link: string): Promise<Article>
{
	return domains.get(domainName)!.getArticle(link);
}

function getRandomArticles(domainName: string, count: number, rules: Rules): Promise<ItemSuggestion[]>
{
	return domains.get(domainName)!.getRandomArticles(count, rules);
}

function createRules(domainName: string, params: URLSearchParams): Rules
{
	const ruleSet = domains.get(domainName)!.ruleSet;
	const rules: Rules = {};

	for (const rule of ruleSet)
	{
		const param = params.get(rule.id);
		rules[rule.id] = param === 'on';
	}

	return rules;
}

function getRule(domainName: string, id: Rule['id']): Rule
{
	const ruleSet = domains.get(domainName)!.ruleSet;

	for (const rule of ruleSet)
	{
		if (rule.id == id)
			return rule;
	}

	throw new Error(`Domain '${domainName}' has no rule with id '${id}'`);
}

function getRules(domainName: string): Rule[]
{
	return domains.get(domainName)!.ruleSet;
}


function getDomain(domainName: string): Domain | undefined
{
	return domains.get(domainName);
}

function getDomains(): Domain[]
{
	return Array.from(domains.values());
}

/** Expects exact domain match, not a link */
function isDomainRegistered(domain: unknown): boolean
{
	return domains.has(domain as string);
}



export const ArticlesHelper = {
	getArticle,
	getRandomArticles,
	createRules,
	getRule,
	getRules, // TODO: Get rid
	getDomain,
	getDomains,
	isDomainRegistered,
}