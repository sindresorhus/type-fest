// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- `Float16Array` is in the ESNext `lib` (ES2025), and the package config has an older one.
/// <reference lib="esnext" />
import {expectTypeOf} from 'nz';
import type {TypedArray} from '../index.d.ts';

expectTypeOf(new Int8Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Uint8Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Uint8ClampedArray()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Int16Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Uint16Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Int32Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Uint32Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Float32Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new Float64Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new BigInt64Array()).toBeAssignableTo<TypedArray>();
expectTypeOf(new BigUint64Array()).toBeAssignableTo<TypedArray>();

// `Float16Array` is looked up through `globalThis`, so it must still accept every buffer type like the other members do.
expectTypeOf(new Float16Array()).toBeAssignableTo<TypedArray>();
expectTypeOf<Float16Array>().toBeAssignableTo<TypedArray>();
expectTypeOf<Float16Array<SharedArrayBuffer>>().toBeAssignableTo<TypedArray>();

expectTypeOf([] as number[]).not.toBeAssignableTo<TypedArray>();
expectTypeOf(new ArrayBuffer(8)).not.toBeAssignableTo<TypedArray>();
expectTypeOf(new DataView(new ArrayBuffer(8))).not.toBeAssignableTo<TypedArray>();

// The `Buffer` type parameter restricts the buffer of every member.
expectTypeOf(new Uint8Array(8)).toBeAssignableTo<TypedArray<ArrayBuffer>>();
expectTypeOf(new Float16Array(8)).toBeAssignableTo<TypedArray<ArrayBuffer>>();
expectTypeOf<BigInt64Array<ArrayBuffer>>().toBeAssignableTo<TypedArray<ArrayBuffer>>();
expectTypeOf<Uint8Array<SharedArrayBuffer>>().not.toBeAssignableTo<TypedArray<ArrayBuffer>>();
expectTypeOf<Float16Array<SharedArrayBuffer>>().not.toBeAssignableTo<TypedArray<ArrayBuffer>>();
expectTypeOf<Uint8Array<SharedArrayBuffer>>().toBeAssignableTo<TypedArray<SharedArrayBuffer>>();
expectTypeOf<Float16Array<SharedArrayBuffer>>().toBeAssignableTo<TypedArray<SharedArrayBuffer>>();
expectTypeOf<Uint8Array>().not.toBeAssignableTo<TypedArray<ArrayBuffer>>();

// The buffer of a narrowed `TypedArray` has the given type.
expectTypeOf<TypedArray<ArrayBuffer>['buffer']>().toBe<ArrayBuffer>();
expectTypeOf<TypedArray['buffer']>().toBe<ArrayBufferLike>();

// @ts-expect-error The buffer type must be an `ArrayBufferLike`.
type InvalidBuffer = TypedArray<string>;

// A narrowed `TypedArray` is assignable to the same arrays with that buffer type, like the `BufferSource` of `@types/node`, also after `subarray()`.
declare const arrayBufferView: TypedArray<ArrayBuffer>;
expectTypeOf(arrayBufferView).toBeAssignableTo<Float16Array<ArrayBuffer> | Exclude<TypedArray<ArrayBuffer>, {readonly [Symbol.toStringTag]: 'Float16Array'}>>();
expectTypeOf(arrayBufferView.subarray(1)).toBeAssignableTo<Float16Array<ArrayBuffer> | Exclude<TypedArray<ArrayBuffer>, {readonly [Symbol.toStringTag]: 'Float16Array'}>>();
expectTypeOf(arrayBufferView.subarray(1).buffer).toBe<ArrayBuffer>();
expectTypeOf<Extract<TypedArray<ArrayBuffer>, {readonly [Symbol.toStringTag]: 'Float16Array'}>>().toBeAssignableTo<Float16Array<ArrayBuffer>>();
expectTypeOf<Float16Array>().toBeAssignableTo<Extract<TypedArray, {readonly [Symbol.toStringTag]: 'Float16Array'}>>();
expectTypeOf<Extract<TypedArray, {readonly [Symbol.toStringTag]: 'Float16Array'}>>().toBeAssignableTo<Float16Array>();

// An `any` buffer accepts every buffer type.
expectTypeOf<Uint8Array<SharedArrayBuffer>>().toBeAssignableTo<TypedArray<any>>();
expectTypeOf<TypedArray<any>['buffer']>().toBe<any>();
