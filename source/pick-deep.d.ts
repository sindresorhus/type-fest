import type {TupleOf} from './tuple-of.d.ts';
import type {BuildObject, NonRecursiveType, ObjectValue} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {Paths} from './paths.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';

/**
Pick properties from a deeply-nested object.

It supports recursing into arrays.

Use-case: Distill complex objects down to the components you need to target.

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
			? UnionToIntersection<PathUnion extends infer P extends string | number ? InternalPickDeep<T, P> : never
			>
			: T extends object
				? SimplifyDeep<UnionToIntersection<PathUnion extends infer P extends string | number ? InternalPickDeep<T, P> : never
				>>
				: never;

/**
Pick an object/array from the given object/array by one path.
*/
type InternalPickDeep<T, Path extends string | number> =
	T extends NonRecursiveType
		? never
		: T extends UnknownArray
			? PickDeepArray<T, Path> extends infer DeepLeaf
				? IsNever<DeepLeaf> extends false
					? DeepLeaf
					: never
				: never
			: T extends object
				? PickDeepObject<T, Path> extends infer DeepLeaf
					? IsNever<DeepLeaf> extends false
						? Simplify<DeepLeaf>
						: never
					: never
				: never;

/**
Pick an object from the given object by one path.
*/
type PickDeepObject<RecordType extends object, P extends string | number> =
	P extends `${infer RecordKeyInPath}.${infer SubPath}`
		? ObjectValue<RecordType, RecordKeyInPath> extends infer ObjectV
			? IsNever<ObjectV> extends false
				? InternalPickDeep<NonNullable<ObjectV>, SubPath> extends infer NextLeaf
					? IsNever<NextLeaf> extends false
						? BuildObject<RecordKeyInPath, NextLeaf, RecordType>
						: never
					: never
				: never
			: never
		: ObjectValue<RecordType, P> extends infer ObjectV
			? IsNever<ObjectV> extends false
				? BuildObject<P, ObjectV, RecordType>
				: never
			: never;

/**
Pick an array from the given array by one path.
*/
type PickDeepArray<ArrayType extends UnknownArray, P extends string | number> =
	// Handle paths that are `${number}.${string}`
	P extends `${infer ArrayIndex extends number}.${infer SubPath}`
		// When `ArrayIndex` is equal to `number`
		? number extends ArrayIndex
			? InternalPickDeep<NonNullable<ArrayType[number]>, SubPath> extends infer NextLeaf
				? IsNever<NextLeaf> extends false
					? ArrayType extends unknown[]
						? NextLeaf[]
						: ArrayType extends readonly unknown[]
							? readonly NextLeaf[]
							: never
					: never
				: never
			: InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath> extends infer NextLeaf
				? IsNever<NextLeaf> extends false
					? ArrayType extends unknown[]
						? [...TupleOf<ArrayIndex>, NextLeaf]
						: ArrayType extends readonly unknown[]
							? readonly [...TupleOf<ArrayIndex>, NextLeaf]
							: never
					: never
				: never
		// When the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// When `ArrayIndex` is `number`
			? number extends ArrayIndex
				? ArrayType
				// When `ArrayIndex` is a number literal
				: ArrayType extends unknown[]
					? [...TupleOf<ArrayIndex>, ArrayType[ArrayIndex]]
					: ArrayType extends readonly unknown[]
						? readonly [...TupleOf<ArrayIndex>, ArrayType[ArrayIndex]]
						: never
			: never;

export {};
