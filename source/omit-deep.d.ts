import type {ArraySplice} from './array-splice.d.ts';
import type {Except} from './except.d.ts';
import type {ExactKey, IsArrayReadonly, LiteralKeyOf, NonRecursiveType, SetArrayAccess, ToString, UnwrapPathBrand} from './internal/index.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {Paths} from './paths.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Omit properties from a deeply-nested object.

It supports recursing into arrays.

It supports removing specific items from an array, replacing each removed item with unknown at the specified index.

Use-case: Remove unneeded parts of complex objects.

Use [`Omit<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) if you only need one level deep.

@example
```
import type {OmitDeep} from 'type-fest';

type Info = {
	userInfo: {
		name: string;
		uselessInfo: {
			foo: string;
		};
	};
};

type UsefulInfo = OmitDeep<Info, 'userInfo.uselessInfo'>;
//=> {userInfo: {name: string}}

// Supports removing multiple paths
type Info1 = {
	userInfo: {
		name: string;
		uselessField: string;
		uselessInfo: {
			foo: string;
		};
	};
};

type UsefulInfo1 = OmitDeep<Info1, 'userInfo.uselessInfo' | 'userInfo.uselessField'>;
//=> {userInfo: {name: string}}

// Supports array
type A = OmitDeep<[1, 'foo', 2], '1'>;
//=> [1, unknown, 2]

// Supports recursing into array

type Info2 = {
	address: [
		{
			street: string;
		},
		{
			street2: string;
			foo: string;
		},
	];
};

type AddressInfo = OmitDeep<Info2, 'address.1.foo'>;
//=> {address: [{street: string}, {street2: string}]}
```

Note: An existing path that goes through a tuple element drops that element's `?` modifier and its `null`.

Note: A path into a tuple intersected with an object type, such as a tagged tuple, loses the object type and some or all of the tuple elements.

@category Object
@category Array
*/
export type OmitDeep<
	T,
	// Autocomplete lists paths up to `a.b.c`, because listing deeper paths can take minutes for large union-heavy types. A generic `Paths<T>` can be a `number`, so any `number` is accepted, like any `string`.
	PathUnion extends LiteralUnion<Paths<T, {maxRecursionDepth: 2}>, string | number>,
> =
	SimplifyDeep<
		OmitDeepHelper<T, UnionToTuple<UnwrapPathBrand<PathUnion>>>,
		UnknownArray>;

/**
Internal helper for {@link OmitDeep}.

Recursively transforms `T` by applying {@link OmitDeepWithOnePath} for each path in `PathTuple`.
*/
type OmitDeepHelper<T, PathTuple extends UnknownArray> =
	PathTuple extends [infer Path, ...infer RestPaths]
		? OmitDeepHelper<OmitDeepWithOnePath<T, Path & (string | number)>, RestPaths>
		: T;

/**
Omit one path from the given object/array.
*/
type OmitDeepWithOnePath<T, Path extends string | number> =
	T extends NonRecursiveType
		? T
		// The array helper matches indexes as strings, so a number index is read as its string form.
		: T extends UnknownArray ? SetArrayAccess<OmitDeepArrayWithOnePath<T, ToString<Path>>, IsArrayReadonly<T>>
			: T extends object ? OmitDeepObjectWithOnePath<T, Path>
				: T;

/**
Omit one path from the given object.
*/
type OmitDeepObjectWithOnePath<ObjectT extends object, P extends string | number> =
	P extends `${infer RecordKeyInPath}.${infer SubPath}`
		? {
			[Key in keyof ObjectT]:
			IsEqual<RecordKeyInPath, ToString<Key>> extends true
				? ExactKey<ObjectT, Key> extends infer RealKey
					? RealKey extends keyof ObjectT
						? OmitDeepWithOnePath<ObjectT[RealKey], SubPath>
						: ObjectT[Key]
					: ObjectT[Key]
				// `Paths` emits `${string}` for a signature, so matching segments transform its value type. Resolve the current key with `ExactKey` to reject alternate numeric spellings.
				: RecordKeyInPath extends ToString<Key> & ToString<ExactKey<Record<Key, unknown>, RecordKeyInPath>>
					// A member that names the key outright is what the key reads, so the signature is left alone.
					? RecordKeyInPath extends ToString<LiteralKeyOf<ObjectT>>
						? ObjectT[Key]
						: OmitDeepWithOnePath<ObjectT[Key], SubPath>
					: ObjectT[Key]
		}
		// Match declared terminal keys by their spelling, including enums; leave index signatures to ExactKey.
		: (ExactKey<ObjectT, P> | keyof {[Key in keyof OmitIndexSignature<ObjectT> as IsEqual<ToString<Key>, ToString<P>> extends true ? Key : never]: never}) extends infer Key
			? IsNever<Key> extends true
				? ObjectT
				: Except<ObjectT, Extract<Key, keyof ObjectT>> // Keep unrelated declared fields covered by an index signature.
			: ObjectT;

/**
Omit one path from from the given array.

It replaces the item to `unknown` at the given index.

@example
```
type A = OmitDeepArrayWithOnePath<[10, 20, 30, 40], '2'>;
//=> [10, 20, unknown, 40]

type B = OmitDeepArrayWithOnePath<[10, 20, 30, 40], '6'>;
//=> [10, 20, 30, 40]
```
*/
type OmitDeepArrayWithOnePath<ArrayType extends UnknownArray, P extends string | number> =
	// Handle paths that are `${number}.${string}`
	P extends `${infer ArrayIndex extends number}.${infer SubPath}`
		// If `ArrayIndex` is equal to `number`. Only the `${number}` segment itself is the wide index, since a segment that is not how JavaScript writes an index, such as `01`, is also inferred as `number`.
		? `${number}.${SubPath}` extends P
			// An array with nothing left to omit is kept empty. Omitting the whole array already removed every index, so a path that continues into one of those indices has nothing to recurse into, and reading the element type would yield `never`, which would collapse the array into `never[]` rather than leaving it empty. An empty tuple is kept as it is for the same reason, rather than keeping the `unknown` placeholder an element that does not exist would leave.
			? ArrayType extends readonly [] ? ArrayType : Array<OmitDeepWithOnePath<NonNullable<ArrayType[number]>, SubPath>>
			// If `ArrayIndex` is a number literal, or `number` for a segment such as `01`. An array without that index is returned unchanged.
			: IsMissingArrayIndex<ArrayType, ArrayIndex> extends true
				? ArrayType
				// A missing descendant leaves the element unchanged, so it must not create required array positions.
				: IsEqual<OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>, NonNullable<ArrayType[ArrayIndex]>> extends true
					? ArrayType
					: ArraySplice<ArrayType, ArrayIndex, 1, [OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>]>
		// If the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// If the path is the `${number}` segment itself. A segment such as `01` is also inferred as `number`, but is not the wide index.
			? `${number}` extends P
				? []
				// If `ArrayIndex` is a number literal, or `number` for a segment such as `01`. An array without that index is returned unchanged.
				: IsMissingArrayIndex<ArrayType, ArrayIndex> extends true
					? ArrayType
					: ArraySplice<ArrayType, ArrayIndex, 1, [unknown]>
			: ArrayType;

/**
Whether `ArrayType` has no `Index` position, such as a negative index, or an index past the end of a fixed-length tuple.

`Index` is `number` when the path segment is a number that is not how JavaScript writes an index, such as `01` or `-0`, which names a key no array has. A fixed-length tuple has a key for each of its positions, including optional ones. An array, or a tuple with a rest element, has no upper bound.

@example
```
type A = IsMissingArrayIndex<[0, 1, 2], 3>;
//=> true

type B = IsMissingArrayIndex<number[], -1>;
//=> true

type C = IsMissingArrayIndex<[0, 1?], 1>;
//=> false

type D = IsMissingArrayIndex<[0, ...number[]], 5>;
//=> false
```
*/
type IsMissingArrayIndex<ArrayType extends UnknownArray, Index extends number> =
	number extends Index
		? true
		: `${Index}` extends `-${string}`
			? true
			: number extends ArrayType['length']
				? false
				: `${Index}` extends keyof ArrayType
					? false
					: true;

export {};
