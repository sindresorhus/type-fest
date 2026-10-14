import type {IsArrayReadonly, SimplifyObject} from './internal/index.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {If} from './if.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsAny} from './is-any.d.ts';

// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = SimplifyObject<{
	[Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source>;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

This is different from the TypeScript `&` (intersection) operator. With `&`, conflicting property types are intersected, which often results in `never`. For example, `{a: string} & {a: number}` makes `a` become `string & number`, which resolves to `never`. With `Merge`, the second type's keys cleanly override the first, so `Merge<{a: string}, {a: number}>` gives `{a: number}` as expected. `Merge` also produces a flattened type (via `Simplify`), making it more readable in IDE tooltips compared to `A & B`.

@example
```
import type {Merge} from 'type-fest';

type Foo = {
	a: string;
	b: number;
};

type Bar = {
	a: number; // Conflicts with Foo['a']
	c: boolean;
};

// With `&`, `a` becomes `string & number` which is `never`. Not what you want.
type WithIntersection = (Foo & Bar)['a'];
//=> never

// With `Merge`, `a` is cleanly overridden to `number`.
type WithMerge = Merge<Foo, Bar>['a'];
//=> number
```

@example
```
import type {Merge} from 'type-fest';

type Foo = {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
};

type Bar = {
	[x: number]: number;
	[x: symbol]: unknown;
	bar: Date;
	baz: boolean;
};

export type FooBar = Merge<Foo, Bar>;
//=> {
// 	[x: string]: unknown;
// 	[x: number]: number;
// 	[x: symbol]: unknown;
// 	foo: string;
// 	bar: Date;
// 	baz: boolean;
// }
```

Note: If you want a merge type that more accurately reflects the runtime behavior of object spread or `Object.assign`, refer to the {@link ObjectMerge} type.

Two tuples are combined position by position, so `Merge<[1, 2, 3], [4, 5]>` is `[4, 5, 3]`. Use {@link Spread} to append them instead.

Known limitations:
- A tuple merged with an object, such as `Merge<[1], {0: 2}>`, collapses to `never`, where the real spread gives an object carrying the array's own members alongside the positions. Use {@link Spread} for that shape.

@see {@link ObjectMerge}
@category Object
*/
export type Merge<Destination, Source> =
	Destination extends unknown // For distributing `Destination`
		? Source extends unknown // For distributing `Source`
			? If<
				IsEqual<Destination, Source>,
				Destination,
				// Two arrays or tuples are combined position by position, see `CombineTwoArrays`.
				Destination extends readonly unknown[]
					? Source extends readonly unknown[]
						// `any` takes both branches of an array check, so the array branch is dropped when either side is `any` to leave just the object merge. A union with `any` is `any`, so this checks both sides at once.
						? IsAny<Destination | Source> extends true
							? never
							: CombineTwoArrays<Destination, Source>
						: _Merge<Destination, Source>
					: _Merge<Destination, Source>
			>
			: never // Should never happen
		: never; // Should never happen

/**
Combines two arrays position by position: the source's elements override the destination's, and the destination's positions past the source are kept, so `Merge<[1, 2, 3], [4, 5]>` is `[4, 5, 3]`. An array of unknown length has no positions to override, so the result is an array of both element types.

Note that this is not what either built-in spread does. The array spread of `[1, 2, 3]` and `[4, 5]` appends, giving `[1, 2, 3, 4, 5]`, and the object spread of the two gives a plain object `{0: 4, 1: 5, 2: 3}` with no `length`. This follows {@link Merge}'s own rule that the source's keys override the destination's keys, applied to the index keys a tuple has. Use {@link Spread} instead when the array spread is what you want.
*/
type CombineTwoArrays<Destination extends readonly unknown[], Source extends readonly unknown[]> =
	// A source with an optional element has no fixed positions to override, so it is treated like an array of unknown length.
	number extends Destination['length'] | Source['length'] | (Source extends Required<Source> ? never : number)
		? IsArrayReadonly<Destination> extends true
			? IsArrayReadonly<Source> extends true
				? ReadonlyArray<Destination[number] | Source[number]>
				: Array<Destination[number] | Source[number]>
			: Array<Destination[number] | Source[number]>
		: IsArrayReadonly<Destination> extends true
			? IsArrayReadonly<Source> extends true
				? readonly [...Source, ...DropLeading<Destination, Source['length']>]
				: [...Source, ...DropLeading<Destination, Source['length']>]
			: [...Source, ...DropLeading<Destination, Source['length']>];

/**
The elements of an array once the given number of leading ones is removed. An optional element counts as a position too.
*/
type DropLeading<Array extends readonly unknown[], Length extends number, Dropped extends unknown[] = []> =
	Dropped['length'] extends Length
		? Array
		: Array extends readonly []
			? []
			: Array extends readonly [unknown?, ...infer Rest]
				? DropLeading<Rest, Length, [...Dropped, unknown]>
				: [];

export type _Merge<Destination, Source> =
	SimplifyObject<
		SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
		& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
	>;

export {};
