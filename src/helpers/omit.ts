export function omit<T, K extends keyof T>(object: T, keys: K[]): Omit<T, K>
{
	const keySet = new Set<K>(keys);
	const copy: Partial<T> = {};

	for (const key in object)
	{
		// TS can suck a thick one here
		// deno-lint-ignore no-explicit-any
		if (keySet.has(key as any))
			continue;

		copy[key] = object[key];
	}

	return copy as Omit<T, K>;
}