import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';

/**
A stricter version of `Exclude<T, U>` that ensures objects with different key modifiers are not considered identical.

TypeScript's built-in `Exclude` and `ExcludeStrict` in `type-fest` don't distinguish key modifiers of objects.

@example
```
import type {ExcludeStrict} from 'type-fest';

type NeverReturned_0 = Exclude<{a: 0} | {readonly a: 0}, {readonly a: 0}>;
//=> never
type NeverReturned_1 = ExcludeStrict<{a: 0} | {readonly a: 0}, {readonly a: 0}>;
//=> never
```

`ExcludeExactly` keeps the union members element if the members are not identical.

@example
```
import type {ExcludeExactly} from 'type-fest';

type ExcludeNever = ExcludeExactly<{a: 0} | {a: 0} | {readonly a: 0}, never>;
//=> {a: 0} | {a: 0} | {readonly a: 0}
type ExcludeReadonlyKey = ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>;
//=> {a: 0}
type ExcludeKey = ExcludeExactly<{readonly a: 0}, {a: 0}>;
//=> {readonly a: 0}
type ExcludeReadonly = ExcludeExactly<{readonly a: 0}, {readonly a: 0}>;
//=> never
type ExcludeSubType = ExcludeExactly<0 | 1 | number, 1>;
//=> number
type ExcludeAllSet = ExcludeExactly<0 | 1 | number, number>;
//=> never
type ExcludeFromUnknown = ExcludeExactly<unknown, string>;
//=> unknown
type ExcludeFromUnknownArray = ExcludeExactly<number[] | unknown[], number[]>;
//=> unknown[]
```

@category Improved Built-in
*/
export type ExcludeExactly<Union, Delete> =
	IfNotAnyOrNever<
		Union,
		_ExcludeExactly<Union, Delete>,
		// If `Union` is `any`, then if `Delete` is `any`, return `never`, else return `Union`.
		If<IsAny<Delete>, never, Union>,
		// If `Union` is `never`, then if `Delete` is `never`, return `never`, else return `Union`.
		If<IsNever<Delete>, never, Union>
	>;

type _ExcludeExactly<Union, Delete> =
	IfNotAnyOrNever<Delete,
		Union extends unknown // For distributing `Union`
			? [Delete extends unknown // For distributing `Delete`
				? If<SimpleIsEqual<Union, Delete>, true, never>
				: never] extends [never] ? Union : never
			: never,
		// If `Delete` is `any` or `never`, then return `Union`,
		// because `Union` cannot be `any` or `never` here.
		Union, Union
	>;

type SimpleIsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

export {};
