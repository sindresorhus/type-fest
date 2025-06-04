import {expectType} from 'tsd';
import type {Xor, XorAll} from '../source/xor.d.ts';

declare const never: never;

// Xor
expectType<Xor<true, true>>(false);
expectType<Xor<true, false>>(true);
expectType<Xor<false, true>>(true);
expectType<Xor<false, false>>(false);
expectType<Xor<true, boolean>>(never);
expectType<Xor<false, boolean>>(never);
expectType<Xor<boolean, boolean>>(never);

expectType<Xor<boolean, never>>(never);
expectType<Xor<never, boolean>>(never);
expectType<Xor<false, never>>(false);
expectType<Xor<never, false>>(false);
expectType<Xor<never, true>>(false);
expectType<Xor<true, never>>(false);
expectType<Xor<never, never>>(never);

// XorAll
expectType<XorAll<[true, true, true]>>(false);
expectType<XorAll<[false, true, true]>>(true);
expectType<XorAll<[false, false, true]>>(true);
expectType<XorAll<[false, false, false]>>(false);
expectType<XorAll<[true, false, false]>>(true);
expectType<XorAll<[true, true, false]>>(true);

expectType<XorAll<[true, true, true], {strict: 1}>>(false);
expectType<XorAll<[false, true, true], {strict: 1}>>(false);
expectType<XorAll<[false, false, true], {strict: 1}>>(true);
expectType<XorAll<[false, false, false], {strict: 1}>>(false);
expectType<XorAll<[true, false, false], {strict: 1}>>(true);
expectType<XorAll<[true, true, false], {strict: 1}>>(false);

// @ts-expect-error
expectType<Xor>(never);
expectType<XorAll<[]>>(never);
expectType<Xor<never, any>>(never);
expectType<Xor<any, any>>(never);

// Single value
expectType<XorAll<[true]>>(false);
expectType<XorAll<[false]>>(false);
expectType<XorAll<[boolean]>>(never);
expectType<XorAll<[never]>>(never);
expectType<XorAll<[any]>>(never);

// Test if boolean is position dependent
expectType<XorAll<[boolean, true, true, true]>>(never);
expectType<XorAll<[true, boolean, true, true]>>(never);
expectType<XorAll<[true, true, boolean, true]>>(never);
expectType<XorAll<[true, true, true, boolean]>>(never);

expectType<XorAll<[boolean, false, false, false]>>(never);
expectType<XorAll<[false, boolean, false, false]>>(never);
expectType<XorAll<[false, false, boolean, false]>>(never);
expectType<XorAll<[false, false, false, boolean]>>(never);
