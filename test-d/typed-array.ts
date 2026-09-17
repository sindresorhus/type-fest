import {expectAssignable, expectType} from 'tsd';
import type {FindGlobalInstanceType, TypedArray} from '../index.d.ts';

// Members available in every supported `lib` target.
expectAssignable<TypedArray>(new Int8Array(10));
expectAssignable<TypedArray>(new Uint8Array(10));
expectAssignable<TypedArray>(new Uint8ClampedArray(10));
expectAssignable<TypedArray>(new Int16Array(10));
expectAssignable<TypedArray>(new Uint16Array(10));
expectAssignable<TypedArray>(new Int32Array(10));
expectAssignable<TypedArray>(new Uint32Array(10));
expectAssignable<TypedArray>(new Float32Array(10));
expectAssignable<TypedArray>(new Float64Array(10));
expectAssignable<TypedArray>(new BigInt64Array(10));
expectAssignable<TypedArray>(new BigUint64Array(10));

// `Float16Array` requires the `ES2025.Float16` lib, so it's conditionally included via `FindGlobalInstanceType` instead of being referenced unconditionally. When this file is compiled with a lib that provides the global (for example, `esnext`), it's part of the union.
expectAssignable<TypedArray>(new Float16Array(10));
expectAssignable<Float16Array>({} as Extract<TypedArray, Float16Array>);

// When a global constructor is missing, the conditional member resolves to `never` and is omitted from the union instead of breaking compilation.
expectType<never>({} as Extract<TypedArray, FindGlobalInstanceType<'NotARealGlobalConstructor'>>);
