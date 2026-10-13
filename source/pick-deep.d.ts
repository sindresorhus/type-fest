import type {TupleOf} from './tuple-of.d.ts';
import type {ExcludeRestElement} from './exclude-rest-element.d.ts';
import type {BuildObject, ExactKey, NonRecursiveType, ObjectValue} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {Paths} from './paths.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';

/**
Pick properties from a deeply-nested object.

It supports recursing into arrays.

Use-case: Distill complex objects down to the components you need to target.

Known limitations:
- Picking several indices of the same tuple in one call resolves to `never`, because each path produces a `unknown`-padded tuple and the results are then intersected, so the tuple's `length` becomes the intersection of the different lengths. Pick one index at a time, or pick the whole array and index into it.
- A path that goes through a tuple element drops that element's `?` modifier and its `null`.
- A path that does not exist is not a type error, so that paths deeper than `Paths` lists can be picked. A missing path is ignored, and if no path exists, the result is `never`.

Use [`Pick<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) if you only need one level deep.

@example
```
import type {PickDeep, PartialDeep} from 'type-fest';

type Configuration = {
	userConfig: {
		name: string;
		age: number;
		address: [
			{
				city1: string;
				street1: string;
			},
			{
				city2: string;
				street2: string;
			},
		];
	};
	otherConfig: any;
};

type NameConfig = PickDeep<Configuration, 'userConfig.name'>;
//=> {userConfig: {name: string}}

// Supports optional properties
type User = PickDeep<PartialDeep<Configuration>, 'userConfig.name' | 'userConfig.age'>;
//=> {userConfig?: {name?: string; age?: number}}

// Supports array
type AddressConfig = PickDeep<Configuration, 'userConfig.address.0'>;
//=> {
// 	userConfig: {
// 		address: [{
// 			city1: string;
// 			street1: string;
// 		}];
// 	};
// }

// Supports recurse into array
type Street = PickDeep<Configuration, 'userConfig.address.1.street2'>;
//=> {userConfig: {address: [unknown, {street2: string}]}}
```

@category Object
@category Array
*/
export type PickDeep<T, PathUnion extends LiteralUnion<Paths<T>, string>> =
	T extends NonRecursiveType
		? never
		: T extends UnknownArray
			? UnionToIntersection<{
				[P in PathUnion]: InternalPickDeep<T, P>;
			}[PathUnion]
			>
			: T extends object
				? SimplifyDeep<UnionToIntersection<{
					[P in PathUnion]: InternalPickDeep<T, P>;
				}[PathUnion]>>
				: never;

/**
Pick an object/array from the given object/array by one path.
*/
type InternalPickDeep<T, Path extends string | number> =
	T extends NonRecursiveType
		? never
		: T extends UnknownArray ? PickDeepArray<T, Path>
			: T extends object ? Simplify<PickDeepObject<T, Path>>
				: never;

/**
Pick an object from the given object by one path.
*/
type PickDeepObject<RecordType extends object, P extends string | number> =
	P extends `${infer RecordKeyInPath}.${infer SubPath}`
		? ObjectValue<RecordType, RecordKeyInPath> extends infer ObjectV
			? IsNever<ObjectV> extends false
				? PickDeepUnderKey<RecordType, RecordKeyInPath, ObjectV, SubPath>
				: never
			: never
		: ObjectValue<RecordType, P> extends infer ObjectV
			// A present property can itself have type `never`, so check whether the key exists instead of using its value as the missing-path marker.
			? IsNever<ExactKey<RecordType, P>> extends false
				? BuildObject<P, ObjectV, RecordType>
				: never
			: never;

/**
Build the picked member under its key. A key covered by an index signature is written as that literal key, like `Pick` does, and a non-literal path segment such as the `${string}` that `Paths` emits for a signature keeps the signature.
*/
type PickDeepUnderKey<RecordType extends object, Key extends string | number, ObjectV, SubPath extends string | number> =
	// A missing path under the key resolves to `never`, so the whole path is missing.
	IsNever<InternalPickDeep<NonNullable<ObjectV>, SubPath>> extends true
		? never
		: BuildObject<Key, PickedDeepValue<RecordType, Key, ObjectV, SubPath>, RecordType>;

/**
The member the pick produces: the recursion needs `NonNullable` to typecheck, so the explicitly declared nullish part of the member is put back, because the member can still be `null` (or `undefined`) when the picked value is read, and reading a path from it throws the same way it does for the source. An optional member keeps the `?` that already covers absence.
*/
type PickedDeepValue<RecordType extends object, Key extends string | number, ObjectV, SubPath extends string | number> =
	InternalPickDeep<NonNullable<ObjectV>, SubPath> | NullishPartOfMember<ObjectV, RecordType, Key>;

/**
The nullish part of the member under the key.
*/
type NullishPartOfMember<ObjectV, RecordType extends object, Key extends string | number> =
	ExactKey<RecordType, Key> extends infer Exact extends PropertyKey
		? Exact extends keyof RecordType
			// `Required` removes implicit absence from optional members while preserving explicitly declared `undefined` with `exactOptionalPropertyTypes`.
			? Extract<Required<RecordType>[Exact], null | undefined>
			: Extract<ObjectV, null>
		: never;

/**
Pick an array from the given array by one path.
*/
type PickDeepArray<ArrayType extends UnknownArray, P extends string | number> =
	// Handle paths that are `${number}.${string}`
	P extends `${infer ArrayIndex extends number}.${infer SubPath}`
		? InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath> extends infer Picked
			// A missing path under the element resolves to `never`, so the whole path is missing.
			? IsNever<Picked> extends true
				? never
				// When `ArrayIndex` is equal to `number`
				: number extends ArrayIndex
					? ArrayType extends unknown[]
						? Picked[]
						: ArrayType extends readonly unknown[]
							? readonly Picked[]
							: never
					// When `ArrayIndex` is a number literal
					: ArrayType extends unknown[]
						? [...TupleOf<ArrayIndex>, Picked]
						: ArrayType extends readonly unknown[]
							? readonly [...TupleOf<ArrayIndex>, Picked]
							: never
			: never
		// When the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// When `ArrayIndex` is `number`
			? number extends ArrayIndex
				? ArrayType
				// When `ArrayIndex` is a number literal
				: ArrayType extends unknown[]
					? [
						...TupleOf<ArrayIndex>,
						// A tuple allows fewer than one element only when its first element is optional, so a picked element that was optional in the source must keep its `?` modifier.
						...ExcludeRestElement<ArrayType> extends readonly [...TupleOf<ArrayIndex>, unknown, ...unknown[]] ? [ArrayType[ArrayIndex]] : [ArrayType[ArrayIndex]?],
					]
					: ArrayType extends readonly unknown[]
						? readonly [
							...TupleOf<ArrayIndex>,
							// A tuple allows fewer than one element only when its first element is optional, so a picked element that was optional in the source must keep its `?` modifier.
							...ExcludeRestElement<ArrayType> extends readonly [...TupleOf<ArrayIndex>, unknown, ...unknown[]] ? [ArrayType[ArrayIndex]] : [ArrayType[ArrayIndex]?],
						]
						: never
			: never;

export {};
