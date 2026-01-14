import type {TupleOf} from './tuple-of.d.ts';
import type {BuildObject, LastOfUnion} from './internal/index.d.ts';
import type {Paths} from './paths.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Or} from './or.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {IsTuple} from './is-tuple.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
`Pick<{0: 0}, '0'>` does not work as expected in some cases, but `ForcePick` handles both `string` and `number` keys correctly.

type Test_ForcePick_0 = ForcePick<[0,1], 1>; // 1
type Test_ForcePick_1 = ForcePick<{0: 'aa'}, '0'>; // {0: 'aa'}
type Test_ForcePick_2 = ForcePick<{'0': 'aa'}, '0'>; // {'0': 'aa'}
type Test_ForcePick_3 = ForcePick<{0: 'aa'}, 0>; // {0: 'aa'}
type Test_ForcePick_4 = ForcePick<{'0': 'aa'}, 0>; // {'0': 'aa'}
*/
type ForcePick<Collection, Key extends (string | number)> =
	Collection extends UnknownArray
		? Collection[Key extends keyof Collection ? Key : never]
		: {[K in keyof Collection as `${K extends (string | number) ? K : never}` extends `${Key}` ? K : never]: Collection[K]};

/**
Forcefully access the property value of `T` by Key if it exists, supporting both `string` and `number` representations; otherwise, return `never`.

type TestForceGet_0 = ForceGet<{2: 'x'}, '2'>; // 'x'
type TestForceGet_1 = ForceGet<{'2': 'x'}, '2'>; // 'x'
type TestForceGet_2 = ForceGet<{2: 'x'}, 2>; // 'x'
type TestForceGet_3 = ForceGet<{'2': 'x'}, 2>; // 'x'
type TestForceGet_4 = ForceGet<['x', 'xx'], 0>; // 'x'
type TestForceGet_5 = ForceGet<['x', 'xx'], '0'>; // 'x'
type TestForceGet_6 = ForceGet<['x', 'xx'], '2'>; // never
type TestForceGet_7 = ForceGet<{a: 'x'}, 'b'>; // never
type TestForceGet_8 = ForceGet<[0,1,2], `${number}`>; // 0 | 1 | 2
type TestForceGet_9 = ForceGet<string[], `${number}`> // string
*/
type ForceGet<T, Key extends PropertyKey> =
	Key extends keyof T
		? T[Key]
		: Key extends string | number
			? StringToNumber<`${Key}`> extends infer Number_ extends number
				? IsNever<Number_> extends false
					? `${Key}` extends `${keyof T extends (string | number) ? keyof T : never}`
						? T[(`${Key}` extends infer K extends keyof T ? K : never)] | T[(Number_ extends infer K extends keyof T ? K : never)]
						/* `${number}` case */
						: `${Key}` extends `${infer N extends number}`
							? [IsEqual<N, number>, T] extends [true, Array<infer ArrayType>]
								? ArrayType
								: never
							: never
					: never
				: never
			: never;

/**
Converts a `string` to a `number` if possible; otherwise, returns `never`.

type Test_StringToNumber_0 = StringToNumber<'s'>; // never
type Test_StringToNumber_1 = StringToNumber<'0'>; // 0
*/
type StringToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;

/**
Returns `true` if the key is theoretically accessible on the value `A`; otherwise, returns `false`.

type Test_IsKeyOf_0 = IsKeyOf<[0, 1], 1>; // true
type Test_IsKeyOf_1 = IsKeyOf<[0, 1], 3>; // false
type Test_IsKeyOf_2 = IsKeyOf<[0, 1], -1>; // false
type Test_IsKeyOf_3 = IsKeyOf<[0, 1], 's'>; // false
type Test_IsKeyOf_4 = IsKeyOf<[0, 1], '1'>; // true
type Test_IsKeyOf_5 = IsKeyOf<[0, 1], '3'>; // false
type Test_IsKeyOf_6 = IsKeyOf<[0, 1], '-1'>; // false
type Test_IsKeyOf_7 = IsKeyOf<[0, 1], `${number}`>; // true
type Test_IsKeyOf_8 = IsKeyOf<Array<{a: 0}>, `${number}`>; // true
type Test_IsKeyOf_9 = IsKeyOf<{0: 'a0'}, 0>; // true
type Test_IsKeyOf_10 = IsKeyOf<{'0': 'a0'}, 0>; // true
type Test_IsKeyOf_11 = IsKeyOf<{0: 'a0'}, '0'>; // true
type Test_IsKeyOf_12 = IsKeyOf<{'0': 'a0'}, 0>; // true
*/
type IsKeyOf<A, K extends PropertyKey> =
	A extends UnknownArray
		? IsEqual<IsTuple<A>, true> extends false
			? K extends `${number}`
				? true
				: K extends (string | number)
					? IsEqual<false, IsNegative<StringToNumber<`${K}`>>>
					: never
			: K extends (string | number)
				? [A['length'], IsEqual<A['length'], number>, IsEqual<false, IsNegative<StringToNumber<`${K}`>>>, GreaterThan<A['length'], StringToNumber<`${K}`>>] extends [number, false, true, true]
					? true
					: false
				: false
		: A extends object
			? K extends (string | number)
				? `${K}` extends `${keyof A extends (string | number) ? keyof A : never}`
					? true
					: false
				: false
			: false;

/**
Returns `A` itself if it is not an `object`.
If `A` is an `object`, behaves like `Pick<A, K>`.
If `A` is an `UnknownArray`, returns `A[K]`.

This fixes https://github.com/sindresorhus/type-fest/issues/1224.

type Test_PickOrSelf_0 = PickOrSelf<string, 'a'>; // string
type Test_PickOrSelf_1 = PickOrSelf<{readonly a?: 0}, 'a'>; // {readonly a?: 0}
type Test_PickOrSelf_2 = PickOrSelf<{2?: 0}, '2'>; // {2?: 0}
type Test_PickOrSelf_3 = PickOrSelf<{2?: 0}, 2>; // {2?: 0}
type Test_PickOrSelf_4 = PickOrSelf<{'2': 0}, 2>; // {'2': 0}
*/
type PickOrSelf<A, K extends (number | string)> =
	A extends UnknownArray
		? ForcePick<A, K>
		: A extends object
			? IsEqual<true, IsKeyOf<A, K>> extends true
				? ForcePick<A, K>
				: never
			: A;

/**
Merges only the `object` types from a union; otherwise, returns the value as-is.

type Test_MergeOnlyObjectUnion_0 = MergeOnlyObjectUnion<0 | string | {readonly a: 0} | {b?: 2} | [0] | [1]>; // string | 0 | [0] | [1] | {readonly a: 0; b?: 2}
*/
type MergeOnlyObjectUnion<MaybeObjectUnion> = _MergeOnlyObjectUnion<MaybeObjectUnion>;
type _MergeOnlyObjectUnion<MaybeObjectUnion, ObjectStack = {}, UnionStack = never> =
	LastOfUnion<MaybeObjectUnion> extends infer L
		? IsNever<L> extends false
			? L extends UnknownArray
				? _MergeOnlyObjectUnion<Exclude<MaybeObjectUnion, L>, ObjectStack, UnionStack | L>
				: L extends object
					? _MergeOnlyObjectUnion<Exclude<MaybeObjectUnion, L>, ObjectStack & L, UnionStack>
					: _MergeOnlyObjectUnion<Exclude<MaybeObjectUnion, L>, ObjectStack, UnionStack | L>
			: UnionStack | Simplify<IsEqual<{}, ObjectStack> extends false ? ObjectStack : never>
		: never;

/**
This doesn't fail with non-object type, to safely support `keyof` with union types including `object`s.

type Test_CoerceKeyof_0 = CoerceKeyof<string | {x: 0}>;
// "x"
*/
type CoerceKeyof<R> = R extends object ? keyof R extends (string | number) ? keyof R : never : never;

/* `BuildObject` supporting `${number}`. */
type Build<K extends PropertyKey, L, M extends object | UnknownArray> =
	`${K extends string ? K : never}` extends `${infer N extends number}`
		? IsEqual<N, number> extends true
			? L[]
			: M extends UnknownArray
				? [...TupleOf<N>, L]
				: BuildObject<K, L, M>
		: BuildObject<K, L, M>;

/* Just rename */
type As<Source, T> = Extract<Source, T>;

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
			},
		];
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
export type PickDeep<T, PathUnion extends Paths<T>> = InternalPickDeep<T, MergeTree<PathToTree<PathUnion>> extends infer M extends PathTreeType ? M : never>;

type InternalPickDeep<Parent, PathTree extends PathTreeType> =
	Parent extends UnknownArray
		? _PickDeep<Parent, PathTree, keyof PathTree>
		: Parent extends object
			? _PickDeep<Parent, PathTree, keyof PathTree>
			: Parent;

type RecursionPickDeep<NextParent, NextPathTree extends PathTreeType> =
	NextParent extends infer NextParentArray extends UnknownArray
		/* NextParent: array */
		? IsEqual<IsTuple<NextParentArray>, false> extends true
			? NextParentArray extends Array<infer _>
				/* If end */
				? ForceGet<NextPathTree, CoerceKeyof<NextPathTree>> extends LeafMarker
					? IsEqual<`${number}`, `${CoerceKeyof<NextPathTree>}`> extends true
						/* `leadingSpreadArray2_Actual` in `test-d/pick-deep.ts` */
						? NextParent
						/* `tailingSpreadArray1_Actual` in `test-d/pick-deep.ts` */
						: [...TupleOf<StringToNumber<`${CoerceKeyof<NextPathTree>}`>>, PickOrSelf<NextParent, CoerceKeyof<NextPathTree>>]
					/* Not end */
					: InternalPickDeep<PickOrSelf<NextParent, CoerceKeyof<NextPathTree>>, As<ForceGet<NextPathTree, CoerceKeyof<NextPathTree>>, PathTreeType>> extends infer Result
						? IsEqual<`${number}`, `${CoerceKeyof<NextPathTree>}`> extends true
							/* `leadingSpreadArray1_Actual` in `test-d/pick-deep.ts` */
							? Result[]
							/* `tailingSpreadArray2_Actual` in `test-d/pick-deep.ts`. */
							: [...TupleOf<StringToNumber<`${CoerceKeyof<NextPathTree>}`>>, Result]
						: never
				: never
			/* NextParent: tuple */
			: InternalPickDeep<NextParent, NextPathTree>
		/* NextParent: object */
		: InternalPickDeep<Simplify<PickOrSelf<NextParent, CoerceKeyof<Simplify<PickOrSelf<NextParent, CoerceKeyof<NextPathTree>>>>>>, NextPathTree>;

type _PickDeep<Parent, PathTree extends PathTreeType, K extends keyof PathTree, U = never> =
	LastOfUnion<K> extends infer L extends keyof PathTree
		? IsNever<L> extends false
			? L extends number | string
				? IsEqual<true, IsKeyOf<Parent, L>> extends true
					/* Detect an end of path. */
					? IsEqual<LeafMarker, PathTree[L]> extends true
						? PickOrSelf<Parent, L> extends infer PickResult
							? PickResult extends UnknownArray
								? _PickDeep<Parent, PathTree, Exclude<K, L>, U | Simplify<[...TupleOf<StringToNumber<`${L}`>>, PickResult]>>
								: _PickDeep<Parent, PathTree, Exclude<K, L>, U | Simplify<PickResult>>
							: never
						: _PickDeep<Parent, PathTree, Exclude<K, L>, U | Simplify<Build<L, RecursionPickDeep<ForceGet<Parent, L>, As<ForceGet<PathTree, L>, PathTreeType>>, As<Parent, object>>>>
					: never
				: never
			: MergeOnlyObjectUnion<U>
		: never;

/**
Converts a dot-delimited path string into a nested object tree structure.
Example: `'a.b.c'` becomes `{a: {b: {c: ''}}}`

type Test_PathToTree = MergeTree<PathToTree<`a.b.${'c'|'d'}.x` | `d.b.${'c'|'d'}`>>;
// {d: {b: {d: ''; c: ''}};
//  a: {b: {d: {x: ''}; c: {x: ''}}}}
*/
type PathToTree<S> =
	S extends `${infer F}.${infer Next}`
		? Next extends `${infer _}.${infer __}`
			? {[K in F]: PathToTree<Next>}
			: {[K in F]: {[L in Next]: LeafMarker}}
		: {[K in S extends string ? S : never]: LeafMarker};

type LeafMarker = '';
type PathTreeType = {[K in string]: PathTreeType | LeafMarker};

/**
Merges nested `object` trees from a union into a single tree structure.

type Test_MergeTree_0 = MergeTree<{a: {b: ''}} | {a: {c: ''}}>; // {a: {b: ''; c: '';}}
*/
type MergeTree<T extends object, M extends object = never> =
	LastOfUnion<T> extends infer L extends object
		? IsNever<L> extends false
			? MergeTree<Exclude<T, L>, MergeTreeObject<M, L>>
			: IsEqual<M, {}> extends true
				? never
				: M
		: never;

type _MergeTreeObject<A extends object, B extends object, KU extends (keyof A | keyof B), R extends object = {}> =
	LastOfUnion<KU> extends infer K
		? IsNever<K> extends false
			? K extends (keyof A) & (keyof B)
				? _MergeTreeObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, MergeTreeObject<As<A[K], object>, As<B[K], object>>, A | B>>>
				: K extends keyof A
					? _MergeTreeObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, A[K], A>>>
					: K extends keyof B
						? _MergeTreeObject<A, B, Exclude<KU, K>, Simplify<R & BuildObject<K, B[K], B>>>
						: R
			: R
		: never;

type MergeTreeObject<A extends object, B extends object> =
	Or<IsNever<A>, IsEqual<A, {}>> extends true
		? B
		: Or<IsNever<B>, IsEqual<B, {}>> extends true
			? A
			: _MergeTreeObject<A, B, As<(KeysOfUnion<A> | KeysOfUnion<B>), (keyof A | keyof B)>>;

export {};
