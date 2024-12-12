import type {UnknownArrayOrTuple} from './internal';
import type {ArrayTail} from './array-tail';

/**
Extracts the type of an array or tuple minus the first N element, where N is the specified depth.

Use-case: This type is useful when you want to rewrap a function and partially modify some of its parameters.

@example
```
import type {ArrayTailDeep} from 'type-fest';

type LocalStorageSchema = { id: string, name: string, token: string };
class LocalStorage {
	getItem<Key extends keyof LocalStorageSchema>(
		key: Key,
		...rest: ArrayTailDeep<Parameters<typeof localStorage.getItem>, 1>
	) {
		return localStorage.getItem(key, ...rest);
	}

	setItem<Key extends keyof LocalStorageSchema>(
		key: Key,
		value: LocalStorageSchema[Key],
		...rest: ArrayTailDeep<Parameters<typeof localStorage.setItem>, 2>
	) {
		return localStorage.setItem(key, value, ...rest);
	}
}
```

@category Array
*/
export type ArrayTailDeep<TArray extends UnknownArrayOrTuple, Deep extends number = 1, Counter extends unknown[] = []> = Counter['length'] extends Deep
	? TArray
	: TArray['length'] extends 0
		? []
		: ArrayTailDeep<ArrayTail<TArray>, Deep, [unknown, ...Counter]>;
