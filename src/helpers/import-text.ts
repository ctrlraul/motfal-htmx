import { join } from 'path';
import { env } from './env';
import { readFileSync } from 'fs';

const cache: Map<string, string> = new Map();
const useCache: boolean = env('ENV') != 'DEV';

export function importText(...pathSegments: string[]): string {

	const filePath = join(...pathSegments);

	let text = cache.get(filePath);

	if (!text)
	{
		text = readFileSync(filePath, 'utf8');

		if (useCache)
			cache.set(filePath, text);
	}

	return text;
}