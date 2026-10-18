import type {CallSignatureOf, IsArrayReadonly, SimplifyObject} from './internal/index.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {If} from './if.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {ObjectMerge} from './object-merge.d.ts'; // For `@link`
import type {Spread} from './spread.d.ts'; // For `@link`
import type {MergeAll} from './merge-all.d.ts'; // For `@link`

/**
Merge two types into a new type. Keys of the second type override keys of the first type.

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

Use {@link MergeAll} to merge more than two types.

Two tuples are combined position by position, so `Merge<[1, 2, 3], [4, 5]>` is `[4, 5, 3]`. Use {@link Spread} to append them instead.

A call signature is kept: the source's if it has one, otherwise the destination's.

Known limitations:
- A tuple merged with an object that has a number key for one of its positions, such as `Merge<[1], {0: 2}>`, intersects the two at that position instead of overriding it, so conflicting literal types make the whole result `never`. Use a string key, such as `{'0': 2}`, instead.
- Inside a generic function, a value such as `{...a, ...b}` (typed as `A & B`) is not assignable to `Merge<A, B>`, because TypeScript cannot resolve `Merge` until `A` and `B` are known. Use a type assertion: `{...a, ...b} as unknown as Merge<A, B>`.
- The kept call signature is rebuilt, so an overloaded function keeps only its last signature, a generic function loses its type parameters, and a type predicate becomes `boolean`. A construct signature is dropped.

@see {@link ObjectMerge}
@see {@link MergeAll}
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
	// The mapped types in `MergeObjects` drop call signatures, so the source's call signature, or else the destination's, is added back. Each branch has its own intersection, so that tooltips show the result rather than `_Merge`.
	unknown extends CallSignatureOf<Source>
		? CallSignatureOf<Destination> & MergeObjects<Destination, Source>
		: CallSignatureOf<Source> & MergeObjects<Destination, Source>;

// Merges the properties and index signatures of two objects. A key of the destination is dropped when the source overrides it: an index signature only by an index signature, and a property only by a property. A property is also dropped when a property key of the source is a subtype of it, so that a string enum key such as `StringEnum.A` overrides `'a'`. The destination is read only once, because each extra read multiplies the work of nested merges, such as in `MergeAll`. The source is split instead of intersected as is, because an intersection with an `any` source is `any`, which loses the properties of the destination.
type MergeObjects<Destination, Source> = SimplifyObject<{
	[Key in keyof Destination as {} extends Record<Key, unknown>
		? Key extends keyof PickIndexSignature<Source> ? never : Key
		: Key extends keyof OmitIndexSignature<Source>
			? never
			: [Extract<keyof OmitIndexSignature<Source>, Key>] extends [never] ? Key : never
	]: Destination[Key];
} & PickIndexSignature<Source> & OmitIndexSignature<Source>>;

export {};
