import type {TupleOf} from './tuple-of.d.ts';
import type {ExcludeRestElement} from './exclude-rest-element.d.ts';
import type {BuildObject, ExactKey, NonRecursiveType, ObjectValue} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsUnion} from './is-union.d.ts';
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
- A path that goes through a tuple element drops that element's `?` modifier and its `null`.
- Picking several indices of the same tuple builds it one element at a time, so an index above about 900 hits TypeScript's recursion limit. A single index works at any size.
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
			? PickDeepArray<T, PathUnion>
			: T extends object
				? SimplifyDeep<PickDeepObject<T, PathUnion>>
				: never;

/**
Pick an object/array from the given object/array by all the paths together.
*/
type InternalPickDeep<T, PathUnion extends string | number> =
	T extends NonRecursiveType
		? never
		: T extends UnknownArray ? PickDeepArray<T, PathUnion>
			: T extends object ? Simplify<PickDeepObject<T, PathUnion>>
				: never;

/**
The first segment of the path.
*/
type FirstKey<Path extends string | number> = Path extends `${infer Key}.${string}` ? Key : Path;

/**
The rest of each path that starts with exactly the given key. The key must match exactly, so that a literal key and a non-literal key such as `${string}` are picked separately.
*/
type SubPaths<PathUnion extends string | number, Key extends string | number> =
	PathUnion extends `${infer Head}.${infer Rest}`
		? [Head, Key] extends [Key, Head]
			? Rest
			: never
		: never;

/**
Pick an object from the given object by all the paths together, so that the paths under the same key are picked from that key's value at once.
*/
type PickDeepObject<RecordType extends object, PathUnion extends string | number> = UnionToIntersection<{
	[Path in PathUnion]: PickDeepObjectKey<RecordType, FirstKey<Path>, PathUnion>;
}[PathUnion]>;

/**
Pick one key from the given object: the whole value when a path ends at the key, otherwise the paths under it.
*/
type PickDeepObjectKey<RecordType extends object, Key extends string | number, PathUnion extends string | number> =
	Key extends PathUnion
		? ObjectValue<RecordType, Key> extends infer ObjectV
			// A present property can itself have type `never`, so check whether the key exists instead of using its value as the missing-path marker.
			? IsNever<ExactKey<RecordType, Key>> extends false
				? BuildObject<Key, ObjectV, RecordType>
				: never
			: never
		: ObjectValue<RecordType, Key> extends infer ObjectV
			? IsNever<ObjectV> extends false
				? PickDeepUnderKey<RecordType, Key, ObjectV, SubPaths<PathUnion, Key>>
				: never
			: never;

/**
Build the picked member under its key. A key covered by an index signature is written as that literal key, like `Pick` does, and a non-literal path segment such as the `${string}` that `Paths` emits for a signature keeps the signature.
*/
type PickDeepUnderKey<RecordType extends object, Key extends string | number, ObjectV, SubPathUnion extends string | number> =
	// A missing path under the key resolves to `never`, so the whole path is missing.
	IsNever<InternalPickDeep<NonNullable<ObjectV>, SubPathUnion>> extends true
		? never
		: BuildObject<Key, PickedDeepValue<RecordType, Key, ObjectV, SubPathUnion>, RecordType>;

/**
The member the pick produces: the recursion needs `NonNullable` to typecheck, so the explicitly declared nullish part of the member is put back, because the member can still be `null` (or `undefined`) when the picked value is read, and reading a path from it throws the same way it does for the source. An optional member keeps the `?` that already covers absence.
*/
type PickedDeepValue<RecordType extends object, Key extends string | number, ObjectV, SubPathUnion extends string | number> =
	InternalPickDeep<NonNullable<ObjectV>, SubPathUnion> | NullishPartOfMember<ObjectV, RecordType, Key>;

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
Pick an array from the given array by all the paths together. The paths for every index (`${number}`) keep the array, and the paths for literal indices are picked into one tuple.
*/
type PickDeepArray<ArrayType extends UnknownArray, PathUnion extends string | number> = UnionToIntersection<
	| {[Path in PathUnion]: PickDeepEveryIndex<ArrayType, FirstKey<Path>, PathUnion>}[PathUnion]
	| PickDeepTuple<ArrayType, PathUnion, {[Path in PathUnion]: PickedIndex<ArrayType, FirstKey<Path>, PathUnion>}[PathUnion]>
>;

/**
Pick every element of the given array when the key is `${number}`.
*/
type PickDeepEveryIndex<ArrayType extends UnknownArray, Key extends string | number, PathUnion extends string | number> =
	`${Key}` extends `${infer ArrayIndex extends number}`
		? number extends ArrayIndex
			? Key extends PathUnion
				? ArrayType
				: InternalPickDeep<NonNullable<ArrayType[number]>, SubPaths<PathUnion, Key>> extends infer Picked
					// A missing path under the elements resolves to `never`, so the whole path is missing.
					? IsNever<Picked> extends true
						? never
						: ArrayType extends unknown[]
							? Picked[]
							: readonly Picked[]
					: never
			: never
		: never;

/**
The literal index the key picks, or `never` when the array cannot have that index or nothing exists under it.
*/
type PickedIndex<ArrayType extends UnknownArray, Key extends string | number, PathUnion extends string | number> =
	`${Key}` extends `${infer ArrayIndex extends number}`
		? number extends ArrayIndex
			? never
			: IsMissingArrayIndex<ArrayType, ArrayIndex> extends true
				? never
				: IsNever<PickedElement<ArrayType, ArrayIndex, PathUnion>> extends true
					? never
					: ArrayIndex
		: never;

/**
Whether the array cannot have the index: a negative index, or an index past the end of a tuple without a rest element.
*/
type IsMissingArrayIndex<ArrayType extends UnknownArray, ArrayIndex extends number> =
	`${ArrayIndex}` extends `-${string}`
		? true
		// A tuple has a key for each of its elements, including the optional ones, and an array of unknown length can have any other index.
		: `${ArrayIndex}` extends keyof ArrayType
			? false
			: number extends ArrayType['length']
				? false
				: true;

/**
The picked element at the index, as a one-element tuple to spread: the whole element when a path ends at the index, otherwise the paths under it.
*/
type PickedElement<ArrayType extends UnknownArray, ArrayIndex extends number, PathUnion extends string | number> =
	`${ArrayIndex}` extends PathUnion
		// A tuple allows fewer than one element only when its first element is optional, so a picked element that was optional in the source must keep its `?` modifier.
		? ExcludeRestElement<ArrayType> extends readonly [...TupleOf<ArrayIndex>, unknown, ...unknown[]]
			? [ArrayType[ArrayIndex]]
			: [ArrayType[ArrayIndex]?]
		: InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPaths<PathUnion, `${ArrayIndex}`>> extends infer Picked
			// A missing path under the element resolves to `never`, so the whole path is missing.
			? IsNever<Picked> extends true
				? never
				: [Picked]
			: never;

/**
Build one tuple from the picked indices, with `unknown` for the indices in between.
*/
type PickDeepTuple<ArrayType extends UnknownArray, PathUnion extends string | number, Indices extends number> =
	[Indices] extends [never]
		? never
		: ArrayType extends unknown[]
			? PickedTuple<ArrayType, PathUnion, Indices>
			: Readonly<PickedTuple<ArrayType, PathUnion, Indices>>;

/**
The tuple for the picked indices. A single index is padded in one step, because building the tuple one element at a time hits the recursion limit for an index near 1000.
*/
type PickedTuple<ArrayType extends UnknownArray, PathUnion extends string | number, Indices extends number> =
	IsUnion<Indices> extends true
		? BuildPickedTuple<ArrayType, PathUnion, Indices>
		: [...TupleOf<Indices>, ...PickedElement<ArrayType, Indices, PathUnion>];

/**
Append the picked element or an `unknown` placeholder for each index until every picked index is in the tuple. A spread optional element that ends up before a required one becomes required with `| undefined`, because a required element cannot follow an optional one.
*/
type BuildPickedTuple<ArrayType extends UnknownArray, PathUnion extends string | number, Indices extends number, Result extends UnknownArray = []> =
	[Indices] extends [never]
		? Result
		// `Required` gives the index of the next element, because the `length` of a tuple with optional elements is a union.
		: Required<Result>['length'] extends infer ArrayIndex extends number
			? BuildPickedTuple<ArrayType, PathUnion, Exclude<Indices, ArrayIndex>, [
				...Result,
				...(ArrayIndex extends Indices ? PickedElement<ArrayType, ArrayIndex, PathUnion> : [unknown]),
			]>
			: never;

export {};
