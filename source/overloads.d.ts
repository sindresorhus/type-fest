import type {HasExplicitThis} from './internal/index.d.ts';
import type {IntRange} from './int-range.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extract all overload signatures of the given function type as a tuple, preserving declaration order.

TypeScript's built-in utility types like `Parameters` and `ReturnType` only work with the last overload signature, [by design](https://github.com/microsoft/TypeScript/issues/32164). This type extracts all overload signatures, allowing you to work with each overload individually.

Use-cases:
- Extract parameter types from specific overloads using `Extract` and `Parameters`
- Analyze all possible function signatures in type-level code
- Extract event handler signatures from framework APIs

Known limitations:
- Generic type parameters are lost -- they are replaced by their upper bound (e.g. `<T>` becomes `unknown`, `<T extends string>` becomes `string`). Functions with fewer than 4 generic overloads are fully extracted; when there are 4 or more generic overloads, extraction stops at the 4th-from-last generic overload and any overloads before it are omitted.
- TypeScript deduplicates overloads that share the same parameters and return type. When one has implicit `this` (no annotation) and another has explicit `this`, they are treated as duplicates, and whichever appears first in the intersection suppresses the other. See `source/internal/function.d.ts` for details on TypeScript's overload enumeration behavior.

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
export type Overloads<FunctionType extends (...args: any) => any> = FunctionType extends unknown
	? IsAny<FunctionType> extends true
		? any
		: CollectOverloads<FunctionType>
	: never;

type MaxOverloadPatterns = 4;
type OverloadIndex = IntRange<0, MaxOverloadPatterns>;
/**
Extract the Nth-from-last (N < MaxOverloadPatterns) overload of a function type as a standalone function, correctly preserving implicit `this` (omitted) vs explicit `this` (kept).
*/
type NthLastOverload<F extends (...args: any) => any, N extends OverloadIndex> = F extends {
	(this: infer T3, ...args: infer P3 extends UnknownArray): infer R3;
	(this: infer T2, ...args: infer P2 extends UnknownArray): infer R2;
	(this: infer T1, ...args: infer P1 extends UnknownArray): infer R1;
	(this: infer T0, ...args: infer P0 extends UnknownArray): infer R0;
}
	? ({
		3: [T3, P3, R3];
		2: [T2, P2, R2];
		1: [T1, P1, R1];
		0: [T0, P0, R0];
	}[N] extends [infer T, infer P extends UnknownArray, infer R]
		? HasExplicitThis<F, T, P, R> extends true
			? (this: T, ...args: P) => R
			: (...args: P) => R
		: never)
	: never;

declare const unique: unique symbol;
type Unique = typeof unique;

/**
Extracts TypeScript's enumerated overload list into a tuple (see "Overload enumeration" above).

`AllOverloads` defaults to `(() => Unique) & F`, prepending a `() => Unique` sentinel that marks the boundary of the original overloads. Each iteration extracts `NthLastOverload<AllOverloads, N>` and then checks whether intersecting the extracted overload onto `AllOverloads` changes what position N sees:

- **Effect observed** (the two differ): the intersection advanced the view. Output `ExtractedN`, intersect it onto `AllOverloads`, and continue with the same N.
- **No effect** (they are equal): the intersection would not advance the view (e.g. aliasing generic overloads that infer to the same concrete signature). Output `ExtractedN` without intersecting, and advance N to the next position.
- **Sentinel hit** (`NthLastOverload` returns `undefined`): no original overload at this depth. Return the accumulated result.

The loop terminates when either N exceeds `OverloadIndex` or the sentinel is reached.

@see https://github.com/microsoft/TypeScript/issues/32164#issuecomment-1146737709
*/
type CollectOverloads<
	F extends (...args: any) => any,
	AllOverloads extends (...args: any) => any = (() => Unique) & F,
	N extends OverloadIndex = 0,
	ResultOverloads extends Array<(...args: any) => any> = [],
> = NthLastOverload<AllOverloads, N> extends infer ExtractedN extends (...args: any) => any
	? IsEqual<ExtractedN, () => Unique> extends true
		? ResultOverloads
		: IsEqual<NthLastOverload<ExtractedN & AllOverloads, N>, ExtractedN> extends true
			? Sum<N, 1> extends infer NextN extends OverloadIndex
				? CollectOverloads<F, AllOverloads, NextN, [ExtractedN, ...ResultOverloads]>
				: [ExtractedN, ...ResultOverloads]
			: CollectOverloads<F, ExtractedN & AllOverloads, N, [ExtractedN, ...ResultOverloads]>
	: never;

export {};
