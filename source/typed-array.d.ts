import type {FindGlobalInstanceType} from './find-global-type.d.ts';

/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.

Note: `Float16Array` is only part of the union when the current TypeScript lib includes `ES2025.Float16` (for example, `esnext`). This lets the type work regardless of the consumer's `lib` target instead of failing compilation with `TS2304: Cannot find name 'Float16Array'`.

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
	// `Float16Array` requires the `ES2025.Float16` lib. `FindGlobalInstanceType` resolves to `never` when the global is missing, so the member is omitted from the union instead of breaking compilation.
	| FindGlobalInstanceType<'Float16Array'>
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

export {};
