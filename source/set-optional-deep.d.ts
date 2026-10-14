import type {IsAny} from './is-any.d.ts';
import type {NonRecursiveType} from './internal/index.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {PartialDeep} from './partial-deep.d.ts';
import type {Paths} from './paths.d.ts';
import type {SetOptional} from './set-optional.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';

/**
Create a type that makes the given keys optional, with support for deeply nested key paths, while keeping the remaining keys as is.

Use-case: Selectively make nested properties optional in complex types like models.

Note: A path that does not exist is not a type error, so that paths deeper than `Paths` lists can be used. A missing path is ignored. A non-literal path segment, such as `string`, matches every key at its level, like a path through an index signature.

Tuple elements follow the same rules as {@link SetOptional}. A selected element with a required element after it stays required and gains `| undefined`, because TypeScript rejects a required element after an optional one.

@example
```
import type {SetOptionalDeep} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c: Array<{
		d: number;
	}>;
};

type SomeOptionalDeep = SetOptionalDeep<Foo, 'a' | `c.${number}.d`>;
//=> {b: string; c: {d?: number}[]; a?: number}

// Set specific indices in an array to be optional.
type ArrayExample = SetOptionalDeep<{a: [number, number, number]}, 'a.1' | 'a.2'>;
//=> {a: [number, number?, number?]}
```

@category Object
*/
export type SetOptionalDeep<
	BaseType,
	// Autocomplete lists paths up to `a.b.c`, because listing deeper paths can take minutes for large union-heavy types. A generic `Paths<T>` can be a `number`, so any `number` is accepted, like any `string`.
	KeyPaths extends LiteralUnion<Paths<BaseType, {maxRecursionDepth: 2}>, string | number>,
> = IsAny<KeyPaths> extends true
	? SimplifyDeep<PartialDeep<BaseType>>
	: SetOptionalDeepHelper<BaseType, KeyPaths>;

/**
Internal helper for {@link SetOptionalDeep}.

Recursively transforms the `BaseType` by applying all terminal keys together at each level, so the order of members in `KeyPaths` cannot affect tuple optionality.
*/
type SetOptionalDeepHelper<BaseType, KeyPaths> =
	[KeyPaths] extends [never]
		? BaseType
		: BaseType extends NonRecursiveType
			? BaseType
			: SetOptional<{
				[Key in keyof BaseType]: SetOptionalDeepHelper<BaseType[Key], SubPaths<KeyPaths, Key>>;
			}, TerminalKeys<KeyPaths> & keyof BaseType>;

/**
Converts terminal paths into keys, keeping a numeric key such as `1.2` distinct from a dotted string path such as `'1.2'`.
*/
type TerminalKeys<KeyPaths> = KeyPaths extends `${string}.${string}`
	? never
	: KeyPaths | StringToNumber<KeyPaths & string>;

/**
Finds the subpaths whose first property matches `Key` in `BaseType`.
*/
type SubPaths<KeyPaths, Key> = KeyPaths extends `${infer Property}.${infer RestPath}`
	? Property extends `${Key & (string | number)}`
		? RestPath
		: never
	: never;

export {};
