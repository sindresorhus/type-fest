import type {KeysOfUnion} from './keys-of-union.d.ts';

/**
Pick keys from a type, distributing the operation over a union.

TypeScript's `Pick` doesn't distribute over unions, leading to the erasure of unique properties from union members when picking keys. This creates a type that only retains properties common to all union members, making it impossible to access member-specific properties after the Pick. Essentially, using `Pick` on a union type merges the types into a less specific one, hindering type narrowing and property access based on discriminants. This type solves that.

Example:

```
type A = {
	discriminant: 'A';
	foo: {
		bar: string;
	};
};

type B = {
	discriminant: 'B';
	foo: {
		baz: string;
	};
};

type Union = A | B;

type PickedUnion = Pick<Union, 'discriminant' | 'foo'>;
//=> {discriminant: 'A' | 'B', foo: {bar: string} | {baz: string}}

declare const pickedUnion: PickedUnion;

if (pickedUnion.discriminant === 'A') {
	// We would like to narrow `pickedUnion`'s type
	// to `A` here, but we can't because `Pick`
	// doesn't distribute over unions.

	// @ts-expect-error
	pickedUnion.foo.bar;
	//=> Error: Property 'bar' does not exist on type '{bar: string} | {baz: string}'.
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/C4TwDgpgBAglC8UDeAoAkAEwJYGcDGATlgLZYB2AhmcAFxQDkM9A3OgGYD2HdqaaARhQJ0cwImQDmrNAF9WclClCQoAIQTJ02fEVKVqdeqpbsuPdAIoAvEWPJT0ChUvDQAqmSwcyGuAB81VhcVAAUsPABrCAwPLx9EMMiAHljvABoGbUIScipgeigA+k4OegA+VgB6Svgy5CzdXIMGJkKGYwySnkFhKFFxCRk2pEEbPrtJGRlFDAg8ABshaDxvUSgwcKiYz286RK3UsiCsNigACg3I6MOAOgac-WAEeERGegBKTTRqqAB1aAA7hwAK7zDBQeZYKJQYAcKCUAgEDgAqAAA0uBx2ZFR9BwMNc6B+sLRMFRUAAFhACBAMvxgU8AcsqPQnvw5hRgThoKj9qjCZUoBgOBAcGQWYLcHY6cBoBwAG5UqDArE4G6Kb4CgACwBwAFoIAAPSB4YD6xEcAjoDHXLE3Eo3HrSaq1KAAUXNvRCSMgBFADB6BSFIvhHCehslUG8+JU9BGQlsAyGATjY369hk9DVMiAA)

@example
```
import type {DistributedPick} from 'type-fest';

type A = {
	discriminant: 'A';
	foo: {
		bar: string;
	};
	extraneous: boolean;
};

type B = {
	discriminant: 'B';
	foo: {
		baz: string;
	};
	extraneous: boolean;
};

// Notice that `foo.bar` exists in `A` but not in `B`.

type Union = A | B;

type PickedUnion = DistributedPick<Union, 'discriminant' | 'foo'>;

declare const pickedUnion: PickedUnion;

if (pickedUnion.discriminant === 'A') {
	pickedUnion.foo.bar;
 	//=> OK

	// @ts-expect-error
	pickedUnion.extraneous;
	//=> Error: Property `extraneous` does not exist on type `Pick<A, 'discriminant' | 'foo'>`.

	// @ts-expect-error
	pickedUnion.foo.baz;
	//=> Error: `bar` is not a property of `{discriminant: 'A'; a: string}`.
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gEWAZxlYAIwFcYUATABWAGMBrAXzgDMoIQ4ByJVAWmZR5OAbgBQonmgCCcALwZRASHK4aBEMAB2AQ00wAXFykilzCBEPoliwtqiG8BTQHMxihm5QAPfLpQRiHENCcwAbFF0xD3FJOAAhOQVlVXUtXQMuOJNFMwskm20ALwd8LVclaMVvX01-QOCwiM0osVEAeja4ADkIGFo0GAALbXgAA1yAOlsoUbhvXBgcOC04UalZknhNXuXNVbjRiZjkNABVTWAIPfkZAB941tjqegpzy+u4bEciUgpnugAPG8rgAaLgqHBqUBpPScOD3Ti5TgAPla5BQNFCdjQNCueDgYFodFeFyuhn+JPerWAzDgAApCS9yMDNBMIVCNDo9HJZPJOMYAJRJRnE5mk1mTaZiOCKDqyZFwADyAGlxLLOgABRa8byoGgwHVQNhQJQiylXCbVKB+AI4NxyhUAUSN0HJbFQsEQqytNsCs3IEEEcG28Hm+KuCBOq3+AKkYM47NSXJgcIRSORhzVHTgWpwOq8eoNKBdJsUZrF7wmkqK9ra8rgzuNhlG01muGDO20BPdxaQcAgtNG6ET0OThn5Ijg2hKTmcDEzDCAA)

@category Object
*/
export type DistributedPick<ObjectType, KeyType extends KeysOfUnion<ObjectType>> =
	ObjectType extends unknown
		? Pick<ObjectType, Extract<KeyType, keyof ObjectType>>
		: never;

export {};
