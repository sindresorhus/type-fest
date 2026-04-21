import type {CollectOverloads} from './internal/index.js';
import type {IsAny} from './is-any.js';

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
		? [(...arguments_: any[]) => any]
		: CollectOverloads<FunctionType>
	: never;



export {};
