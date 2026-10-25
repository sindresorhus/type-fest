import type {IsEqual} from './is-equal.d.ts';

/**
A stricter version of `Exclude<T, U>` that excludes types only when they are exactly identical.

@example
```
import type {ExcludeExactly} from 'type-fest';

type TestExclude1 = Exclude<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> 1 | 2 | 3

type TestExcludeExactly1 = ExcludeExactly<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> 'a' | 'b' | 'c' | 1 | 2 | 3

type TestExclude2 = Exclude<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> never

type TestExcludeExactly2 = ExcludeExactly<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> 'a' | 'b' | 'c' | 1 | 2 | 3

type TestExclude3 = Exclude<{a: string} | {a: string; b: string}, {a: string}>;
//=> never

type TestExcludeExactly3 = ExcludeExactly<{a: string} | {a: string; b: string}, {a: string}>;
//=> {a: string; b: string}
```

@category Improved Built-in
*/
// For `any`, an exact `any` deletion returns `never`; every other deletion keeps it.
// `never` has no members to distribute, so it remains `never` for every deletion.
// A deletion of `any` or `never` keeps every non-`any` member: `any` cannot match it exactly, and `never` supplies no matching member.
export type ExcludeExactly<Union, Delete> =
	Union extends unknown // For distributing `Union`
		? [Delete extends unknown // For distributing `Delete`
			? IsEqual<Union, Delete> extends true ? true : never
			: never] extends [never] ? Union : never
		: never;

export {};
