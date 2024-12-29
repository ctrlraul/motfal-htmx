import { Article } from '../../data/article.ts';
import { ItemSuggestion, Domain, Rules } from '../articles-helper.ts';
import * as Case from '@wok/case';
import Axios from 'axiod';


interface ApiResponsePokemonSecies {
	count: number;
	next: string | null;
	previous: string | null;
	results: {
		name: string;
		url: string;
	}[];
}

interface ApiResponsePokemon {
	abilities: {
		ability: {
			name: string,
			url: string
		},
		is_hidden: false,
		slot: number
	}[],
	base_experience: number,
	cries: {
		latest: string,
		legacy: string
	},
	forms: {
		name: string,
		url: string
	}[],
	game_indices:{
		game_index: number,
		version: {
			name: string,
			url: string
		}
	}[],
	height: number,
	held_items: {
		item: {
			name: string,
			url: string
		},
		version_details: {
			rarity: number,
			version: {
				name: string,
				url: string
			}
		}[]
	}[],
	id: number,
	is_default: true,
	location_area_encounters: string,
	moves: {
		move: {
			name: string,
			url: string
		},
		version_group_details: {
			level_learned_at: number,
			move_learn_method: {
				name: string,
				url: string
			},
			version_group: {
				name: string,
				url: string
			}
		}[]
	}[],
	name: string,
	order: number,
	past_abilities: unknown[],
	past_types: unknown[],
	species: {
		name: string,
		url: string
	},
	sprites: {
		back_default: string,
		back_female: null,
		back_shiny: string,
		back_shiny_female: null,
		front_default: string,
		front_female: null,
		front_shiny: string,
		front_shiny_female: null,
		other: unknown,
		versions: unknown
	},
	stats: {
		base_stat: number,
		effort: number,
		stat: {
			name: string,
			url: string
		}
	}[],
	types: {
		slot: number,
		type: {
			name: string,
			url: string
		}
	}[],
	weight: number
}


const apiBaseUrl = 'https://pokeapi.co/api/v2';
const axios = Axios.create({ baseURL: apiBaseUrl });

let totalPokemon = 0;


async function getArticle(id: string): Promise<Article>
{
	const parsedId = parsePokemonId(id); 
	const response = await axios.get<ApiResponsePokemon>('/pokemon/' + parsedId);
	const article: Article = {
		description: response.data.name + ' is a pokemon!',
		italic: false,
		link: new URL('/pokemon/' + response.data.id, apiBaseUrl).href,
		title: response.data.name,
		thumbnail: response.data.sprites.front_default,
	}

	return article;
}

async function getRandomArticles(count: number, _rules: Rules): Promise<ItemSuggestion[]>
{
	if (totalPokemon === 0)
	{
		const response = await axios.get<ApiResponsePokemonSecies>('/pokemon-species?limit=1');
		totalPokemon = response.data.count;
	}
	
	const randomIds = Array.from({ length: count }, () => Math.floor(Math.random() * totalPokemon) + 1);
	const promises = randomIds.map(id => axios.get<ApiResponsePokemon>('/pokemon/' + id));
	const responses = await Promise.all(promises);
	
	const suggestions: ItemSuggestion[] = responses.map(response => ({
		id: response.data.id.toString(),
		title: Case.titleCase(response.data.name),
		search: 'https://www.pokemon.com/us/pokedex/' + response.data.name,
	}));

	return suggestions;
}

function parsePokemonId(id: string): string
{
	// Assume it's a pokedex url ending with "/<pokemon-name>"
	if (id.indexOf('/') !== -1)
	{
		const pathSegments = id.split('/');
		const encodedTitle = pathSegments[pathSegments.length - 1];
		return Case.paramCase(decodeURIComponent(encodedTitle));
	}

	const int = parseInt(id);

	if (!isNaN(int))
		return int.toString();

	return Case.paramCase(id);
}



export const PokeApi: Domain = {
	name: 'Pokemon',
	itemName: 'pokemon',
	submitInputPlaceholder: 'Pokemon name, ID, or pokedex link',
	ruleSet: [],
	getArticle,
	getRandomArticles,
}