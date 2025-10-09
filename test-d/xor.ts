import {expectType} from 'tsd';
import type {Xor} from '../source/xor.d.ts';

declare const boolean: boolean;

expectType<Xor<true, true>>(false);
expectType<Xor<true, false>>(true);
expectType<Xor<false, true>>(true);
expectType<Xor<false, false>>(false);

expectType<Xor<true, boolean>>(boolean);
expectType<Xor<boolean, true>>(boolean);
expectType<Xor<false, boolean>>(boolean);
expectType<Xor<boolean, false>>(boolean);
expectType<Xor<boolean, boolean>>(boolean);

// Boundary cases
expectType<Xor<true, any>>(boolean);
expectType<Xor<any, true>>(boolean);
expectType<Xor<false, any>>(boolean);
expectType<Xor<any, false>>(boolean);
expectType<Xor<boolean, any>>(boolean);
expectType<Xor<any, boolean>>(boolean);
expectType<Xor<any, any>>(boolean);

expectType<Xor<true, never>>(true);
expectType<Xor<never, true>>(true);
expectType<Xor<false, never>>(false);
expectType<Xor<never, false>>(false);
expectType<Xor<boolean, never>>(boolean);
expectType<Xor<never, boolean>>(boolean);
expectType<Xor<never, never>>(false);
