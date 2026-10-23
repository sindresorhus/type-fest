import {expectTypeOf} from 'nz';
import type {IsAny, StructuredCloneable} from '../index.d.ts';

/*
Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

# Supported types
## JavaScript types
- Array
- ArrayBuffer
- Boolean
- DataView
- Date
- Error types (but see Error types below).
- Map
- Number
- Object: but only plain objects (e.g. from object literals).
- Primitive types, except symbol.
- RegExp: but note that lastIndex is not preserved.
- Set
- String
- TypedArray

## Error types
For Error types, the error name must be one of: Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError (or will be set to "Error").

## Web/API types
 - Blob
 - File

## DOM exclusive types (not included)
 - AudioData
 - CropTarget
 - CryptoKey
 - DOMException: browsers must serialize the properties name and message. Other attributes may also be serialized/cloned.
 - DOMMatrix
 - DOMMatrixReadOnly
 - DOMPoint
 - DOMPointReadOnly
 - DOMQuad
 - DOMRect
 - DOMRectReadOnly
 - FileList
 - FileSystemDirectoryHandle
 - FileSystemFileHandle
 - FileSystemHandle
 - GPUCompilationInfo
 - GPUCompilationMessage
 - ImageBitmap
 - ImageData
 - RTCCertificate
 - VideoFrame
*/

// Date, Boolean, Number, String, BigInt
expectTypeOf(new Date()).toBeAssignableTo<StructuredCloneable>();
declare const booleanWrapperObject: Boolean;
expectTypeOf(booleanWrapperObject).toBeAssignableTo<StructuredCloneable>();
declare const numberWrapperObject: Number;
expectTypeOf(numberWrapperObject).toBeAssignableTo<StructuredCloneable>();
declare const stringWrapperObject: String;
expectTypeOf(stringWrapperObject).toBeAssignableTo<StructuredCloneable>();
// The algorithm serializes a `[[BigIntData]]` platform object in the same step as the other three wrappers, and `structuredClone` hands one back, so the fourth belongs with them. It has to be named as a type because `Object(1n)` is declared to return `any`.
declare const bigintWrapperObject: BigInt;
expectTypeOf(bigintWrapperObject).toBeAssignableTo<StructuredCloneable>();

// Primitive types, except symbol.
expectTypeOf<undefined>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<null>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<true>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<1>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<1n>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<''>().toBeAssignableTo<StructuredCloneable>();
declare const symbolValue: symbol;
expectTypeOf(symbolValue).not.toBeAssignableTo<StructuredCloneable>();

// RegExp: but note that lastIndex is not preserved.
expectTypeOf(/foo/).toBeAssignableTo<StructuredCloneable>();

// ArrayBuffer, DataView
expectTypeOf(new ArrayBuffer(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new DataView(new ArrayBuffer(10))).toBeAssignableTo<StructuredCloneable>();

// TypedArray
expectTypeOf(new Int8Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Uint8Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Uint8ClampedArray(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Int16Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Uint16Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Int32Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Uint32Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Float32Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Float64Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new BigInt64Array(10)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new BigUint64Array(10)).toBeAssignableTo<StructuredCloneable>();

// Error types
declare const error: Error;
expectTypeOf(error).toBeAssignableTo<StructuredCloneable>();
declare const evalError: EvalError;
expectTypeOf(evalError).toBeAssignableTo<StructuredCloneable>();
declare const rangeError: RangeError;
expectTypeOf(rangeError).toBeAssignableTo<StructuredCloneable>();
declare const referenceError: ReferenceError;
expectTypeOf(referenceError).toBeAssignableTo<StructuredCloneable>();
declare const syntaxError: SyntaxError;
expectTypeOf(syntaxError).toBeAssignableTo<StructuredCloneable>();
declare const typeError: TypeError;
expectTypeOf(typeError).toBeAssignableTo<StructuredCloneable>();
declare const uriError: URIError;
expectTypeOf(uriError).toBeAssignableTo<StructuredCloneable>();

// Object: but only plain objects (e.g. from object literals).
({}) satisfies StructuredCloneable;
({x: 10}) satisfies StructuredCloneable;
({x: {y: 10}}) satisfies StructuredCloneable;
expectTypeOf({x: 10} as const).toBeAssignableTo<StructuredCloneable>();
class CustomType {}
expectTypeOf(new CustomType()).not.toBeAssignableTo<StructuredCloneable>();
class CustomTypeWithProperties {
	foo = 'wow';
	bar = 1;
}
expectTypeOf(new CustomTypeWithProperties()).not.toBeAssignableTo<StructuredCloneable>();

// Array
[] satisfies StructuredCloneable;
[1, 2, 3] satisfies StructuredCloneable;
expectTypeOf([1, 2, 3] as const).toBeAssignableTo<StructuredCloneable>();
[[1, 2], [3, 4]] satisfies StructuredCloneable;
[{x: 1}, {x: 2}] satisfies StructuredCloneable;

// Map
expectTypeOf(new Map<string, Date>()).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Map<Date, string[]>()).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Map<Date, Map<string, number>>()).toBeAssignableTo<StructuredCloneable>();

// Set
expectTypeOf(new Set<number>()).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Set<string[]>()).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new Set<Set<string>>()).toBeAssignableTo<StructuredCloneable>();

// Web/API types

declare const blob: Blob;
expectTypeOf(blob).toBeAssignableTo<StructuredCloneable>();

declare const file: File;
expectTypeOf(file).toBeAssignableTo<StructuredCloneable>();

// Shared buffers can be cloned directly or inside ordinary collections.
expectTypeOf<SharedArrayBuffer>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<{buffer: SharedArrayBuffer}>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<Map<string, SharedArrayBuffer>>().toBeAssignableTo<StructuredCloneable>();

expectTypeOf<readonly SharedArrayBuffer[]>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<readonly [string, SharedArrayBuffer]>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<{readonly data?: {readonly buffer: SharedArrayBuffer}}>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<ReadonlyMap<SharedArrayBuffer, readonly SharedArrayBuffer[]>>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<ReadonlySet<SharedArrayBuffer>>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<ReadonlyMap<string, ReadonlySet<SharedArrayBuffer>>>().toBeAssignableTo<StructuredCloneable>();

// Views over shared memory are cloneable along with their backing buffer.
const sharedBuffer = new SharedArrayBuffer(16);
expectTypeOf(new Uint8Array(sharedBuffer)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new BigInt64Array(sharedBuffer)).toBeAssignableTo<StructuredCloneable>();
expectTypeOf(new DataView(sharedBuffer)).toBeAssignableTo<StructuredCloneable>();
({buffer: sharedBuffer, view: new Uint8Array(sharedBuffer)}) satisfies StructuredCloneable;

// Adding shared memory does not admit functions, symbols, or non-cloneable collections.
expectTypeOf<{buffer: SharedArrayBuffer; callback: () => void}>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<ReadonlyMap<string, SharedArrayBuffer | symbol>>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<ReadonlySet<SharedArrayBuffer | (() => void)>>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<Promise<SharedArrayBuffer>>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<WeakMap<object, SharedArrayBuffer>>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<unknown>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<readonly never[]>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<readonly any[]>().toBeAssignableTo<StructuredCloneable>();
expectTypeOf<() => never>().not.toBeAssignableTo<StructuredCloneable>();
expectTypeOf<IsAny<StructuredCloneable>>().toBe<false>();

declare function cloneSupported<Value extends StructuredCloneable>(value: Value): Value;
expectTypeOf(cloneSupported(sharedBuffer)).toBe<SharedArrayBuffer>();
expectTypeOf(cloneSupported({buffer: sharedBuffer} as const)).toBe<{readonly buffer: SharedArrayBuffer}>();
// @ts-expect-error A callback remains uncloneable even when a sibling field is supported.
cloneSupported({buffer: sharedBuffer, callback: () => undefined});
