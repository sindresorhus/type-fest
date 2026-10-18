import type {IsAny} from './is-any.d.ts';
import type {Merge} from './merge.d.ts';
import type {ObjectMerge} from './object-merge.d.ts'; // For `@link`

/**
Merge any number of types into a new type. Keys of each type override keys of the types before it.

This is the same as nesting {@link Merge}, so `MergeAll<[A, B, C]>` is `Merge<Merge<A, B>, C>`. Each step follows the rules of `Merge`, including how it handles index signatures, tuples, and call signatures.

Use-cases:
- Combine layers of configuration, where later layers override earlier ones.
- Type a function that merges a variable number of objects.

@example
```
import type {MergeAll} from 'type-fest';

type Defaults = {
	host: string;
	port: number;
	verbose: false;
};

type FileConfig = {
	host: 'localhost';
	logLevel: 'info' | 'error';
};

type CliFlags = {
	verbose: boolean;
};

type Config = MergeAll<[Defaults, FileConfig, CliFlags]>;
//=> {
// 	port: number;
// 	host: 'localhost';
// 	logLevel: 'info' | 'error';
// 	verbose: boolean;
// }
```

@example
```
import type {MergeAll} from 'type-fest';

declare function mergeAll<Objects extends readonly object[]>(...objects: Objects): MergeAll<Objects>;

const merged = mergeAll({a: 1, b: 'b'}, {b: true}, {c: 3});
//=> {a: number; b: boolean; c: number}
```

`MergeAll<[]>` is `{}`, and `MergeAll<[A]>` is `A`, without simplifying it. Unions are distributed, so `MergeAll<[A | B, C]>` is `Merge<A, C> | Merge<B, C>`.

Note: Like `Merge`, a later key always replaces the same key before it, even when the later key is optional, so `MergeAll<[{a: 1}, {a?: 2}]>` is `{a?: 2}`. If you want a result that more accurately reflects the runtime behavior of object spread, where it would be `{a: 1 | 2}`, nest {@link ObjectMerge} instead.

Known limitations:
- A tuple or array without a fixed length, such as `[A, B?]`, `[A, ...B[]]`, or `A[]`, is not supported and gives `never`. This includes spreading an array into a function like the one above. Use a union of tuples, such as `[A] | [A, B]`, instead of an optional element.
- The known limitations of {@link Merge} apply to each step.
- Each anonymous object type, such as an object literal passed to a function like the one above, adds a level of nesting, the same as nested `Merge`. So merging more than about 30 of them (about 25 when they have a call signature) fails with “Type instantiation is excessively deep and possibly infinite”. Named types, such as type aliases and interfaces, go much further.

@see {@link Merge}
@see {@link ObjectMerge}
@category Object
*/
export type MergeAll<Types extends readonly unknown[]> = IsAny<Types> extends true ? any : _MergeAll<Types>;

type _MergeAll<Types extends readonly unknown[]> =
	Types extends readonly []
		? {}
		: Types extends readonly [infer Only]
			? Only
			: Types extends readonly [infer First, infer Second, ...infer Rest]
				? _MergeAll<[Merge<First, Second>, ...Rest]>
				: never;

export {};
