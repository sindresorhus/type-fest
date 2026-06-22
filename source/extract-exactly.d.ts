import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';

/**
A stricter version of `Extract<T, U>` that extracts types only when they are exactly identical.

@example
```
import type {ExtractExactly} from 'type-fest';

type TestExtract1 = Extract<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> 'a' | 'b' | 'c'

type TestExtractExactly1 = ExtractExactly<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> never

type TestExtract2 = Extract<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> 'a' | 'b' | 'c' | 1 | 2 | 3

type TestExtractExactly2 = ExtractExactly<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> never

type TestExtract3 = Extract<{a: string} | {a: string; b: string}, {a: string}>;
//=> {a: string} | {a: string; b: string}

type TestExtractExactly3 = ExtractExactly<{a: string} | {a: string; b: string}, {a: string}>;
//=> {a: string}
```

@category Improved Built-in
*/
export type ExtractExactly<Union, Match> =
	IfNotAnyOrNever<Union, {
		ifNot: _ExtractExactly<Union, Match>;
		// If `Union` is `any`, then if `Match` is `any`, return `any`, else return `never`.
		ifAny: If<IsAny<Match>, Union, never>;
		// If `Union` is `never`, return `never`, doesn't matter what `Match` is.
		ifNever: never;
	}>;

type _ExtractExactly<Union, Match> =
	IfNotAnyOrNever<Match, {
		ifNot: Union extends unknown // For distributing `Union`
			? [Match extends unknown // For distributing `Match`
				? If<IsEqual<Union, Match>, true, never>
				: never] extends [never] ? never : Union
			: never;
		// If `Match` is `any` or `never`, then return `never`,
		// because `Union` cannot be `any` or `never` here.
		ifAny: never;
		ifNever: never;
	}>;

export {};
