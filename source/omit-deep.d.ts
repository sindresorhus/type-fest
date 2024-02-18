import type {ArraySplice} from './array-splice';
import type {ExactKey, IsArrayReadonly, NonRecursiveType, SetArrayAccess, ToString} from './internal';
import type {IsEqual} from './is-equal';
import type {SimplifyDeep} from './merge-deep';
import type {Paths} from './paths';
import type {SharedUnionFieldsDeep} from './shared-union-fields-deep';
import type {UnknownArray} from './unknown-array';

/**
Omit properties from a deeply-nested object.

It supports recursing into arrays. If the leaf item in path is a index, we will set that item to 'unknown'.

Use-case: Remove unneeded parts of complex objects.

@example
```
import type {OmitDeep, PartialDeep} from 'type-fest';

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
		];
	};
	otherConfig: any;
};

type NameConfig = PickDeep<Configuration, 'userConfig.name'>;
// type NameConfig = {
// 	userConfig: {
// 		name: string;
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
// };

// Supports recurse into array
type Street = PickDeep<Configuration, 'userConfig.address.1.street2'>;
// type Street = {
// 	userConfig: {
// 		address: [
// 			unknown,
// 			{street2: string}
// 		];
// 	};
// };
```

@category Object
@category Array
*/
export type OmitDeep<T, PathUnion extends Paths<T>> =
	SimplifyDeep<
	SharedUnionFieldsDeep<
	{[P in PathUnion]: OmitDeepWithOnePath<T, P>}[PathUnion]
	>
	>;

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
			: ObjectT[Key]
	}
	: ExactKey<ObjectT, P> extends infer Key
		? Key extends PropertyKey
			? Omit<ObjectT, Key>
			: ObjectT
		: ObjectT;

/**
Omit one path from from the given array.

we will delete the item at the given index.

@example
```
type A = OmitDeepArray<[10, 20, 30, 40], 2>;
//=> type A = [10, 20, 40];
```
*/
type OmitDeepArrayWithOnePath<ArrayType extends UnknownArray, P extends string | number> =
	// Handle paths that are `${number}.${string}`
	P extends `${infer ArrayIndex extends number}.${infer SubPath}`
		// When `ArrayIndex` is equal to `number`
		? number extends ArrayIndex
			? Array<OmitDeepWithOnePath<NonNullable<ArrayType[number]>, SubPath>>
			// When `ArrayIndex` is a number literal
			: ArraySplice<ArrayType, ArrayIndex, 1, [OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>]>
		// When the path is equal to `number`
		: P extends `${infer ArrayIndex extends number}`
			// When `ArrayIndex` is `number`
			? number extends ArrayIndex
				? []
				// When `ArrayIndex` is a number literal
				: ArraySplice<ArrayType, ArrayIndex, 1>
			: never;
