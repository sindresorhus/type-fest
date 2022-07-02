import {expectNotType, expectType} from 'tsd';
import {MergeDeep} from '../index';

// Test MergeDeep inputs

declare const sign1: MergeDeep<{}, {}>; // {}
declare const sign2: MergeDeep<[], []>; // Never

expectNotType<never>(sign1);
expectType<never>(sign2);

declare const sign3: MergeDeep<{}, []>; // Never
declare const sign4: MergeDeep<[], {}>; // Never

expectType<never>(sign3);
expectType<never>(sign4);

declare const sign5: MergeDeep<42, {}>; // Never
declare const sign6: MergeDeep<42, []>; // Never

expectType<never>(sign5);
expectType<never>(sign6);

declare const sign7: MergeDeep<{}, 42>; // Never
declare const sign8: MergeDeep<[], 42>; // Never

expectType<never>(sign7);
expectType<never>(sign8);

declare const sign9: MergeDeep<{}, {}, {recurseIntoArrays: true}>; // {}
declare const sign10: MergeDeep<[], [], {recurseIntoArrays: true}>; // []

expectNotType<never>(sign9);
expectNotType<never>(sign10);

declare const sign11: MergeDeep<{}, [], {recurseIntoArrays: true}>; // Never
declare const sign12: MergeDeep<[], {}, {recurseIntoArrays: true}>; // Never

expectType<never>(sign11);
expectType<never>(sign12);

declare const sign13: MergeDeep<42, {}, {recurseIntoArrays: true}>; // Never
declare const sign14: MergeDeep<42, [], {recurseIntoArrays: true}>; // Never

expectType<never>(sign13);
expectType<never>(sign14);

declare const sign15: MergeDeep<{}, 42, {recurseIntoArrays: true}>; // Never
declare const sign16: MergeDeep<[], 42, {recurseIntoArrays: true}>; // Never

expectType<never>(sign15);
expectType<never>(sign16);

// Test flat plain object

const src1 = {life: 42, name: 'nyan', a: undefined};
const dest1 = {life: '24', fly: true, b: undefined};
const merge1 = {...dest1, ...src1};

expectType<MergeDeep<typeof dest1, typeof src1>>(merge1);

// Test deep plain object

const src2 = {a: 'a', b: src1, c: {d: src1}};
const dest2 = {a: 'z', b: dest1, c: {d: dest1}};
const merge2 = {a: 'a', b: merge1, c: {d: merge1}};

expectType<MergeDeep<typeof dest2, typeof src2>>(merge2);
