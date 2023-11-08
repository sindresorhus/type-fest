import type {BuildObject, BuildTuple, ToString} from './internal';
import type {Paths} from './paths';
import type {Simplify} from './simplify.d';
import type {UnionToIntersection} from './union-to-intersection.d';
import type {UnknownArray} from './unknown-array';
import type {UnknownRecord} from './unknown-record.d';

/**
Pick properties from a deeply-nested object.

It supports recursing into arrays.

Use-case: Distill complex objects down to the components you need to target.

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
			}
		]
	};
	otherConfig: any;
};

type NameConfig = PickDeep<Configuration, 'userConfig.name'>;
// type NameConfig = {
// 	userConfig: {
// 		name: string;
// 	}
// };

// Supports optional properties
type User = PickDeep<PartialDeep<Configuration>, 'userConfig.name' | 'userConfig.age'>;
// type User = {
// 	userConfig?: {
// 		name?: string;
// 		age?: number;
// 	};
// };

// Supports array
type AddressConfig = PickDeep<Configuration, 'userConfig.address.0'>;
// type AddressConfig = {
// 	userConfig: {
// 		address: [{
// 			city1: string;
// 			street1: string;
// 		}];
// 	};
// }

// Supports recurse into array
type Street = PickDeep<Configuration, 'userConfig.address.1.street2'>;
// type Street = {
// 	userConfig: {
// 		address: [
// 			unknown,
// 			{street2: string}
// 		];
// 	};
// }
```

@category Object
@category Array
*/
export type PickDeep<T extends UnknownRecord | UnknownArray, PathUnion extends Paths<T>> =
	T extends UnknownRecord
		? Simplify<UnionToIntersection<{
			[P in PathUnion]: InternalPickDeep<T, P>;
		}[PathUnion]>>
		: T extends UnknownArray
			? UnionToIntersection<{
				[P in PathUnion]: InternalPickDeep<T, P>;
			}[PathUnion]
			>
			: never;

/**
Pick an object/array from the given object/array by one path.
*/
type InternalPickDeep<
	T extends UnknownRecord | UnknownArray,
	Path extends string | number, // Checked paths, extracted from unchecked paths
> =
	T extends UnknownArray ? PickDeepArray<T, Path>
		: T extends UnknownRecord ? Simplify<PickDeepObject<T, Path>>
			: never;

/**
Pick an object from the given object by one path.
*/
type PickDeepObject<RecordType extends UnknownRecord, P extends string | number> =
	P extends `${infer RecordKeyInPath}.${infer SubPath}`
		? BuildObject<RecordKeyInPath, InternalPickDeep<NonNullable<RecordType[RecordKeyInPath]>, SubPath>, RecordType>
		: P extends keyof RecordType | ToString<keyof RecordType> // Handle number keys
			? BuildObject<P, RecordType[P], RecordType>
			: never;

/**
Pick an array from the given array by one path.
*/
type PickDeepArray<ArrayType extends UnknownArray, P extends string | number> =
	// Handle paths that are `${number}.${string}`
	P extends `${infer ArrayIndex extends number}.${infer SubPath}`
		// When `ArrayIndex` is equal to `number`
		? number extends ArrayIndex
			? ArrayType extends unknown[]
				? Array<InternalPickDeep<NonNullable<ArrayType[number]>, SubPath>>
				: ArrayType extends readonly unknown[]
					? ReadonlyArray<InternalPickDeep<NonNullable<ArrayType[number]>, SubPath>>
					: never
			// When `ArrayIndex` is a number literal
			: ArrayType extends unknown[]
				? [...BuildTuple<ArrayIndex>, InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath>]
				: ArrayType extends readonly unknown[]
					? readonly [...BuildTuple<ArrayIndex>, InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath>]
					: never
		// When the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// When `ArrayIndex` is `number`
			? number extends ArrayIndex
				? ArrayType
				// When `ArrayIndex` is a number literal
				: ArrayType extends unknown[]
					? [...BuildTuple<ArrayIndex>, ArrayType[ArrayIndex]]
					: ArrayType extends readonly unknown[]
						? readonly [...BuildTuple<ArrayIndex>, ArrayType[ArrayIndex]]
						: never
			: never;
