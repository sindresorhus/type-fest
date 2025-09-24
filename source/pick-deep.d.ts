import type {BuildObject, BuildTuple, NonRecursiveType, ObjectValue} from './internal/index.d.ts';
import type {Get} from './get.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Paths} from './paths.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Or} from './or.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

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
export type PickDeep<T, PathUnion extends Paths<T>> =
	T extends NonRecursiveType
		? never
		: T extends UnknownArray
			? MergeNarrow<{[P in PathUnion]: InternalPickDeep<T, P>}[PathUnion]>
			: T extends object
				? MergeNarrow<Simplify<PickDeepObject<T, PathUnion>>>
				: never;

/**
Pick an object/array from the given object/array by one path.
*/
type InternalPickDeep<T, Path extends (string | number)> =
	T extends NonRecursiveType
		? T
		: T extends UnknownArray ? PickDeepArray<T, Path>
			: T extends object ? Simplify<PickDeepObject<T, Path>>
				: T;

type _PickDeepObject<RecordType extends object, P extends (string | number)> =
	ObjectValue<RecordType, P> extends infer ObjectV
		? IsNever<ObjectV> extends false
			? BuildObject<P, ObjectV, RecordType>
			: never
		: never;

/**
Pick an object from the given object by one path.
*/
type PickDeepObject<RecordType extends object, P extends (string | number)> =
	P extends `${infer RecordKeyInPath}.${infer SubPath}`
		// `ObjectV` doesn't extends `(UnknownArray | object)` when the union type includes members that don't satisfy that constraint.
		// In such cases, `InternalPickDeep` returns the original type itself.
		// This allows union types to preserve their structure.
		? ObjectValue<RecordType, RecordKeyInPath> extends infer ObjectV
			? IsNever<ObjectV> extends false
				? SubPath extends `${infer _MainSubPath}.${infer _NextSubPath}`
					? BuildObject<RecordKeyInPath, InternalPickDeep<ObjectV, SubPath>, ObjectV extends (UnknownArray | object) ? ObjectV : never>
					: ObjectV extends UnknownArray
						? Simplify<BuildObject<RecordKeyInPath, PickDeepArray<ObjectV, SubPath>, RecordType>>
						: Simplify<BuildObject<RecordKeyInPath, PickOrSelf<GetOrSelf<RecordType, RecordKeyInPath>, SubPath>, RecordType>>
				: never
			: never
		// Case where the path is not concatenated.
		: Simplify<_PickDeepObject<RecordType, P>>;

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

type _Pick<T, Key extends string | number> =
  {[k in keyof T as `${k extends (string | number) ? k : never}` extends `${Key}` ? k : never]: T[k]};

type IsKeyOf<a, k extends string | number> = `${k}` extends `${keyof a extends (string | number) ? keyof a : never}` ? true : false;

type GetOrSelf<a, k extends (number | string)> = (a extends any ? IsEqual<true, IsKeyOf<a, k>> extends true ? Get<a, `${k}`> : a : never);

type PickOrSelf<a, k extends (number | string)> = (a extends any ? IsEqual<true, IsKeyOf<a, k>> extends true ? _Pick<a, k> : a : never);

type LastOfUnion<T> =
UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
	? R
	: never;

/*
This is a local function that merges multiple objects obtained as a union type when the path in `PickDeep` is a union type.

Assuming `T` is a union type:
 - If a member `t` of `T` is not a collection type, it is returned as is.
 - If `t` is an object, each property is narrowed via union, and `MergeNarrow` is applied to any property that is a collection (which would also be a union type). The results are then merged.
 - The same logic applies to tuples, but merged via intersection.

Here is an example that explains why tuples are merged via intersection and objects via union.

type testMergeNarrow_0 = MergeNarrow<string | number | [unknown, 1, [2, 3, unknown], {x: unknown}] | [0, unknown, unknown, {x: 1, y: 2}] | {a: number, b: {readonly c: unknown}, d: [unknown, 1]} | {a: 100, b: 199, d: [0, unknown]}>

// string
// | number
// | { a: number;
//     d: [0, 1];
//     b: 199 | {readonly c: unknown;}}
// | [0, 1, [2, 3, unknown], {x: unknown; y: 2}]
*/
type MergeNarrow<T, R extends UnknownArray = never, M extends object = never> =
	LastOfUnion<T> extends infer L
		? IsNever<T> extends false
			? L extends UnknownArray
				? MergeNarrow<Exclude<T, L>, MergeNarrowTuple<R, L>, M>
				: L extends object
					? MergeNarrow<Exclude<T, L>, R, MergeNarrowObject<M, L>>
					: L | MergeNarrow<Exclude<T, L>, R, M>
			: IsEqual<[R, M], [[], {}]> extends true
				? never
				: R | M
		: never;

type _MergeNarrowTuple<A extends UnknownArray, B extends UnknownArray> =
	A extends readonly [infer HeadA, ...infer RestA]
		? B extends readonly [infer HeadB, ...infer RestB]
			? [HeadA, HeadB] extends infer M extends [UnknownArray, UnknownArray]
				? [MergeNarrowTuple<M[0], M[1]>, ..._MergeNarrowTuple<RestA, RestB>]
				: [HeadA, HeadB] extends infer M extends [object, object]
					? [MergeNarrowObject<M[0], M[1]>, ..._MergeNarrowTuple<RestA, RestB>]
					: [HeadA & HeadB, ..._MergeNarrowTuple<RestA, RestB>]
			: [HeadA, ...RestA]
		: [];

type MergeNarrowTuple<A extends UnknownArray, B extends UnknownArray> =
	A['length'] extends 0
		? B
		: B['length'] extends 0
			? A
			: true extends GreaterThan<A['length'], B['length']>
				? _MergeNarrowTuple<A, B>
				: _MergeNarrowTuple<B, A>;

type _MergeNarrowObject<A extends object, B extends object, KU extends (keyof A | keyof B), R extends object = {}> =
	LastOfUnion<KU> extends infer K
		? K extends (keyof A) & (keyof B)
			? _MergeNarrowObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, MergeNarrow<A[K] | B[K]>, A & B>>>
			: K extends keyof A
				? _MergeNarrowObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, A[K], A>>>
				: K extends keyof B
					? _MergeNarrowObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, B[K], B>>>
					: R
		: never;

type MergeNarrowObject<A extends object, B extends object> =
	Or<IsEqual<A, never>, IsEqual<A, {}>> extends true
		? B
		: Or<IsEqual<B, never>, IsEqual<B, {}>> extends true
			? A
			// Not Intersection.
			: _MergeNarrowObject<A, B, (KeysOfUnion<A> | KeysOfUnion<B>) extends infer K extends (keyof A | keyof B) ? K : never>;
