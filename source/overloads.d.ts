import type {HasExplicitThis} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IntRange} from './int-range.d.ts';

declare const unique: unique symbol;
type Unique = typeof unique;
type MaxOverloadPatterns = 4;
type OverloadIndex = IntRange<0, MaxOverloadPatterns>;

/**
Extract all overload signatures of the given function type as a tuple, preserving declaration order.

TypeScript's built-in utility types like `Parameters` and `ReturnType` only work with the last overload signature, [by design](https://github.com/microsoft/TypeScript/issues/32164). This type extracts all overload signatures, allowing you to work with each overload individually.

Use-cases:
- Extract parameter types from specific overloads using `Extract` and `Parameters`
- Analyze all possible function signatures in type-level code
- Extract event handler signatures from framework APIs

Known limitations:
- Generic overloads:
  - Type parameters are lost. They are replaced by their upper bound (for example, `<T>` becomes `unknown`, and `<T extends string>` becomes `string`).
  - When there are 4 or more generic overloads, extraction stops at the 4th-from-last generic overload and any overloads before it are omitted.
  - Implicit `this` (no annotation) is indistinguishable from explicit `this: unknown`, so the output always includes `this: unknown`.
- Type predicates and assertion signatures are lost: `x is string` becomes `boolean`, and `asserts x is string` becomes `void`. Such overloads also have the generic overload limitations above.
- TypeScript deduplicates overloads that share the same parameters and return type. When one has implicit `this` (no annotation) and another has explicit `this`, they are treated as duplicates, and whichever appears first in the intersection suppresses the other.

@example
```
import type {Overloads} from 'type-fest';

declare function request(url: string): Promise<string>;
declare function request(url: string, options: {json: true}): Promise<unknown>;

type RequestOverloads = Overloads<typeof request>;
//=> [(url: string) => Promise<string>, (url: string, options: {
// 	json: true;
// }) => Promise<unknown>]

// To get a union instead of a tuple, index with [number]:
type RequestOverloadsUnion = Overloads<typeof request>[number];
//=> ((url: string) => Promise<string>) | ((url: string, options: {
// 	json: true;
// }) => Promise<unknown>)
```

@see https://github.com/microsoft/TypeScript/issues/14107
@see https://github.com/microsoft/TypeScript/issues/32164

@category Function
*/
export type Overloads<FunctionType extends (...arguments_: any) => any> = FunctionType extends unknown
	? IsAny<FunctionType> extends true
		? any
		: _Overloads<(() => Unique) & FunctionType>
	: never;

type _Overloads<
	FunctionType extends (...arguments_: any) => any,
	Index extends OverloadIndex = 0,
	ResultOverloads extends Array<(...arguments_: any) => any> = [],
> = NthLastOverload<FunctionType, Index> extends infer Extracted extends (...arguments_: any) => any
	? IsEqual<Extracted, () => Unique> extends true
		? ResultOverloads // Sentinel reached, return accumulated result.
		: IsEqual<NthLastOverload<Extracted & FunctionType, Index>, Extracted> extends true
			// `NthLastOverload` can’t preserve generics. So, if the last overload contains generics the extracted signature replaces them with their constraints. This means intersecting the extracted signature with the original function won’t cause the last overload to move to the first. Therefore, in such cases we increment `Index`.
			? Sum<Index, 1> extends infer NextIndex extends OverloadIndex
				? _Overloads<FunctionType, NextIndex, [Extracted, ...ResultOverloads]>
				: [Extracted, ...ResultOverloads]
			: _Overloads<Extracted & FunctionType, Index, [Extracted, ...ResultOverloads]>
	: never;

/**
Extract the `Index`-th-from-last (`Index` < `MaxOverloadPatterns`) overload of a function type as a standalone function, correctly preserving implicit `this` (omitted) vs explicit `this` (kept).
*/
type NthLastOverload<FunctionType extends (...arguments_: any) => any, Index extends OverloadIndex> = FunctionType extends {
	(this: infer This3, ...arguments_: infer Parameters3 extends UnknownArray): infer Return3;
	(this: infer This2, ...arguments_: infer Parameters2 extends UnknownArray): infer Return2;
	(this: infer This1, ...arguments_: infer Parameters1 extends UnknownArray): infer Return1;
	(this: infer This0, ...arguments_: infer Parameters0 extends UnknownArray): infer Return0;
}
	? ({
		3: [This3, Parameters3, Return3];
		2: [This2, Parameters2, Return2];
		1: [This1, Parameters1, Return1];
		0: [This0, Parameters0, Return0];
	}[Index] extends [infer This, infer Parameters_ extends UnknownArray, infer Return]
		? HasExplicitThis<FunctionType, This, Parameters_, Return> extends true
			? (this: This, ...arguments_: Parameters_) => Return
			: (...arguments_: Parameters_) => Return
		: never)
	: never;

export {};
