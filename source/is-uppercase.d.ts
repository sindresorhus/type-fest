import type {TitlecaseCharacter} from './internal/characters.d.ts';
import type {AllExtend} from './all-extend.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';

/**
Returns a boolean for whether the given string literal is uppercase.

@example
```
import type {IsUppercase} from 'type-fest';

type A = IsUppercase<'ABC'>;
//=> true

type B = IsUppercase<'Abc'>;
//=> false

type C = IsUppercase<string>;
//=> boolean
```
*/
export type IsUppercase<S extends string> =
	// Check a whole literal directly to avoid a character walk and its recursion limit.
	IsStringLiteral<S> extends true
		// The template form reads a string enum member by its value, since the member itself is not assignable to `Uppercase<string>`.
		? S extends unknown
			? `${UnwrapBrand<S>}` extends Uppercase<string> ? true : false
			: never
		: AllExtend<_IsUppercase<S>, true>;

/**
Loops through each part in the string and returns a boolean array indicating whether each part is uppercase.
*/
type _IsUppercase<S extends string, Accumulator extends boolean[] = []> = S extends `${infer First}${infer Rest}`
	? _IsUppercase<Rest, [...Accumulator, IsUppercaseHelper<First>]>
	: [...Accumulator, IsUppercaseHelper<S>];

/**
Returns a boolean for whether an individual part of the string is uppercase.
*/
type IsUppercaseHelper<S extends string> = S extends Uppercase<string>
	? true
	: S extends Lowercase<string> | Uncapitalize<string> | `${string}${Lowercase<string>}${string}`
		? false
		// A titlecase character is changed by both lowercasing and uppercasing, so it is neither, but none of the patterns above name it either.
		: S extends TitlecaseCharacter
			? false
			: boolean;

export {};
