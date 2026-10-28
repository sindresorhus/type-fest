import type {IsEqual} from './is-equal.d.ts';

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
// If `Union` is `any`, only an exact `any` match keeps it.
// If `Union` is `never`, there are no members to distribute, so the result remains `never`.
// An `any` match cannot equal a non-`any` member, and a `never` match supplies no matching member.
export type ExtractExactly<Union, Match> =
	Union extends unknown // For distributing `Union`
		? [Match extends unknown // For distributing `Match`
			? IsEqual<Union, Match> extends true ? true : never
			: never] extends [never] ? never : Union
		: never;

export {};
