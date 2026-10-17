import type {Simplify} from './simplify.d.ts'; // For `@link`

/**
Represents an object with `unknown` value. You probably want this instead of `{}`.

Use case: You have an object whose keys and values are unknown to you.

Use it to accept a plain object. Unlike `Record<string, any>` and `{[key: string]: any}`, it rejects functions, arrays, and class instances. Its values can still be anything.

Note: An `interface` is not assignable to it, because TypeScript does not give an interface an implicit index signature. Use a `type` alias or {@link Simplify} instead.

@example
```
import type {UnknownRecord} from 'type-fest';

function toJson(object: UnknownRecord) {
	return JSON.stringify(object);
}

toJson({hello: 'world'}); // Ok

toJson({hello: () => 'world'}); // Ok

// @ts-expect-error
toJson(() => ({hello: 'world'})); // Error: not a plain object

// @ts-expect-error
toJson(['hello', 'world']); // Error: not a plain object

function isPlainObject(value: unknown): value is UnknownRecord {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

const value: unknown = {hello: 'world'};

if (isPlainObject(value)) {
	const v = value;
	//=> UnknownRecord
}
```

@category Type
@category Object
*/
export type UnknownRecord = Record<PropertyKey, unknown>;

export {};
