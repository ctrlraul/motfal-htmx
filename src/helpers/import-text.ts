import { env } from '@raul/env';
import nodePath from 'node:path';

const cache: Map<string, string> = new Map();
const useCache: boolean = env('ENV') != 'DEV';

export function importText(...pathSegments: string[]): string {

	const path = nodePath.join(...pathSegments);

	let text = cache.get(path);

	if (!text)
	{
		text = Deno.readTextFileSync(path);

		if (useCache)
			cache.set(path, text);
	}

	return text;
}