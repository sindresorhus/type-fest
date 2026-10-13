import type {ArraySplice} from './array-splice.d.ts';
import type {ExactKey, IsArrayReadonly, LiteralKeyOf, NonRecursiveType, SetArrayAccess, ToString} from './internal/index.d.ts';
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

Note: A path that goes through a tuple element drops that element's `?` modifier and its `null`.

@category Object
@category Array
*/
export type OmitDeep<T, PathUnion extends LiteralUnion<Paths<T>, string>> =
	SimplifyDeep<
		OmitDeepHelper<T, UnionToTuple<PathUnion>>,
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
		: T extends UnknownArray ? SetArrayAccess<OmitDeepArrayWithOnePath<T, Path>, IsArrayReadonly<T>>
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
				// A signature covers every key of its kind, so a key in the path that is not the mapped key still goes through it, and the omit is applied to the signature's value type because there is no single key to remove. `Paths` emits such a path as `${string}`.
				: RecordKeyInPath extends ToString<Key>
					// A member that names the key outright is what the key reads, so the signature is left alone.
					? RecordKeyInPath extends ToString<LiteralKeyOf<ObjectT>>
						? ObjectT[Key]
						: OmitDeepWithOnePath<ObjectT[Key], SubPath>
					: ObjectT[Key]
		}
		: ExactKey<ObjectT, P> extends infer Key
			? IsNever<Key> extends true
				? ObjectT
				: Key extends PropertyKey
					? Omit<ObjectT, Key>
					: ObjectT
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
		// If `ArrayIndex` is equal to `number`
		? number extends ArrayIndex
			// An array with nothing left to omit is kept empty. Omitting the whole array already removed every index, so a path that continues into one of those indices has nothing to recurse into, and reading the element type would yield `never`, which would collapse the array into `never[]` rather than leaving it empty. An empty tuple is kept as it is for the same reason, rather than keeping the `unknown` placeholder an element that does not exist would leave.
			? ArrayType extends readonly [] ? ArrayType : Array<OmitDeepWithOnePath<NonNullable<ArrayType[number]>, SubPath>>
			// If `ArrayIndex` is a number literal. A fixed-length tuple without that index is returned unchanged.
			: IsMissingTupleIndex<ArrayType, ArrayIndex> extends true
				? ArrayType
				: ArraySplice<ArrayType, ArrayIndex, 1, [OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>]>
		// If the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// If `ArrayIndex` is `number`
			? number extends ArrayIndex
				? []
				// If `ArrayIndex` is a number literal. A fixed-length tuple without that index is returned unchanged.
				: IsMissingTupleIndex<ArrayType, ArrayIndex> extends true
					? ArrayType
					: ArraySplice<ArrayType, ArrayIndex, 1, [unknown]>
			: ArrayType;

/**
Whether `ArrayType` is a fixed-length tuple without the `Index` position, such as an index past its end or a negative index.

A fixed-length tuple has a key for each of its positions, including optional ones. An array, or a tuple with a rest element, has no such bound.

@example
```
type A = IsMissingTupleIndex<[0, 1, 2], 3>;
//=> true

type B = IsMissingTupleIndex<[0, 1, 2], -1>;
//=> true

type C = IsMissingTupleIndex<[0, 1?], 1>;
//=> false

type D = IsMissingTupleIndex<[0, ...number[]], 5>;
//=> false
```
*/
type IsMissingTupleIndex<ArrayType extends UnknownArray, Index extends number> =
	number extends ArrayType['length']
		? false
		: `${Index}` extends keyof ArrayType
			? false
			: true;

export {};
