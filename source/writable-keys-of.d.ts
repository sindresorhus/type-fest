import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts';

/**
Extract all writable keys from the given type.

This is useful when you want to create a new type that contains writable keys only.

@example
```
import type {WritableKeysOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	readonly id: number;
}

type UpdateRequest<Entity extends object> = Pick<Entity, WritableKeysOf<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gdSsGBDAIwBsUBpFRAZwHkAzAXzlqghDgHIlUBaWlSmOwDcAKBHAAdjBRRaeAMZoAqpRkYRASAl4QKAFxwBOCQHNRGygFco23QaOSzYjVBR4AJhAlFEcYO4MJSxACGVF6MS5lMHc8aQAlFABHS34YAB4AUSlcXxQAD2kJd0o4CAIAKxR5GAA+OABeOAAFYHkAayycpAAaOGxcQhJyKjoumFza2tEReS8BOEsYuJQARgMlZYTk1IF0lRl6pvRNW30OAEEiNpR2Hs0rGx1z9gv5XTuReiEgA)

@category Utilities
*/
export type WritableKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? Exclude<keyof Type, ReadonlyKeysOf<Type>>
		: never; // Should never happen

export {};
