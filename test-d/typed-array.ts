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
