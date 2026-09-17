import {expectAssignable, expectNotAssignable} from 'tsd';
import type {TypedArray} from '../index.d.ts';

expectAssignable<TypedArray>(new Int8Array());
expectAssignable<TypedArray>(new Uint8Array());
expectAssignable<TypedArray>(new Uint8ClampedArray());
expectAssignable<TypedArray>(new Int16Array());
expectAssignable<TypedArray>(new Uint16Array());
expectAssignable<TypedArray>(new Int32Array());
expectAssignable<TypedArray>(new Uint32Array());
expectAssignable<TypedArray>(new Float32Array());
expectAssignable<TypedArray>(new Float64Array());
expectAssignable<TypedArray>(new BigInt64Array());
expectAssignable<TypedArray>(new BigUint64Array());

// `Float16Array` is looked up through `globalThis`, so it must still accept every buffer type like the other members do.
expectAssignable<TypedArray>(new Float16Array());
expectAssignable<TypedArray>({} as Float16Array);
expectAssignable<TypedArray>({} as Float16Array<SharedArrayBuffer>);

expectNotAssignable<TypedArray>([] as number[]);
expectNotAssignable<TypedArray>(new ArrayBuffer(8));
expectNotAssignable<TypedArray>(new DataView(new ArrayBuffer(8)));
