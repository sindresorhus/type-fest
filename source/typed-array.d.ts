import type {FindGlobalType} from './find-global-type.d.ts';

/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.

`Float16Array` is included only when it exists in your TypeScript `lib` (`ESNext` or `ES2025` and later).

@category Array
*/
export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	// Looked up through `globalThis` so that a `lib` without `Float16Array` gets `never` here instead of a compile error. The `prototype` type is `Float16Array<ArrayBufferLike>`, matching the other members.
	| FindGlobalType<'Float16Array'>['prototype']
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

export {};
