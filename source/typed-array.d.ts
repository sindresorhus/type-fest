import type {FindGlobalType} from './find-global-type.d.ts';

/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.

Use the `Buffer` type parameter to require a specific buffer type. For example, `TypedArray<ArrayBuffer>` excludes views of a `SharedArrayBuffer`, which APIs that take a `BufferSource`, like `crypto.subtle.digest()`, do not accept.

`Float16Array` is included only when it exists in your TypeScript `lib` (`ESNext` or `ES2025` and later) or is added by `@types/node`.

@example
```
import type {TypedArray} from 'type-fest';

declare function hash(data: TypedArray<ArrayBuffer>): Promise<ArrayBuffer>;

void hash(new Uint8Array(8));

// @ts-expect-error
void hash(new Uint8Array(new SharedArrayBuffer(8)));
```

@category Array
*/
export type TypedArray<Buffer extends ArrayBufferLike = ArrayBufferLike> =
	| Int8Array<Buffer>
	| Uint8Array<Buffer>
	| Uint8ClampedArray<Buffer>
	| Int16Array<Buffer>
	| Uint16Array<Buffer>
	| Int32Array<Buffer>
	| Uint32Array<Buffer>
	| Float16ArrayOf<Buffer>
	| Float32Array<Buffer>
	| Float64Array<Buffer>
	| BigInt64Array<Buffer>
	| BigUint64Array<Buffer>;

/**
`Float16Array` is looked up through `globalThis`, so that a `lib` without it gets `never` here instead of a compile error. The `prototype` type is `Float16Array<ArrayBufferLike>`, and a type cannot pass `Buffer` to an interface it cannot name, so the members that use the buffer type are narrowed instead. `subarray()` must be narrowed too, because `@types/node` defines `BufferSource` with `Float16Array<ArrayBuffer>`. The narrowed members come first, so that `subarray()` resolves to them.
*/
type Float16ArrayOf<Buffer extends ArrayBufferLike> = {
	readonly buffer: Buffer;
	subarray(begin?: number, end?: number): Float16ArrayOf<Buffer>;
} & FindGlobalType<'Float16Array'>['prototype'];

export {};
